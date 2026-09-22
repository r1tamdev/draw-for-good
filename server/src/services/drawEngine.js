import { supabaseAdmin } from '../config/supabase.js';
import { calculatePoolSplit, calculateTotalPool, getActiveSubscriberCount } from './prizePool.js';

function generateRandomNumbers(count, max) {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers);
}

async function generateAlgorithmicNumbers(count, max) {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('score');

  if (error) throw error;

  const frequency = {};
  for (const row of data) {
    frequency[row.score] = (frequency[row.score] || 0) + 1;
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([score]) => Number(score))
    .filter((n) => n <= max);

  const selected = sorted.slice(0, count);

  while (selected.length < count) {
    const candidate = Math.floor(Math.random() * max) + 1;
    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }

  return selected;
}

function matchCount(userScores, drawnNumbers) {
  return userScores.filter((s) => drawnNumbers.includes(s)).length;
}

export async function simulateDraw(drawMonth, mode) {
  const activeCount = await getActiveSubscriberCount(supabaseAdmin);
  const totalPool = calculateTotalPool(activeCount, 20, 0.3);

  const { data: previousDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_rollover')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const rollover = previousDraw?.jackpot_rollover || 0;
  const { pool5, pool4, pool3 } = calculatePoolSplit(totalPool, rollover);

  const drawnNumbers =
    mode === 'algorithmic'
      ? await generateAlgorithmicNumbers(5, 45)
      : generateRandomNumbers(5, 45);

  return {
    draw_month: drawMonth,
    mode,
    status: 'simulated',
    drawn_numbers: drawnNumbers,
    total_pool: totalPool,
    pool_5: pool5,
    pool_4: pool4,
    pool_3: pool3,
    jackpot_rollover: rollover,
  };
}

export async function publishDraw(simulatedDraw) {
  const { data: draw, error: drawError } = await supabaseAdmin
    .from('draws')
    .insert({ ...simulatedDraw, status: 'published', published_at: new Date().toISOString() })
    .select()
    .single();

  if (drawError) throw drawError;

  const { data: users, error: usersError } = await supabaseAdmin
    .from('profiles')
    .select('id');

  if (usersError) throw usersError;

  const winners = [];

  for (const user of users) {
    const { data: scores } = await supabaseAdmin
      .from('scores')
      .select('score')
      .eq('user_id', user.id);

    if (!scores || scores.length === 0) continue;

    const userScores = scores.map((s) => s.score);
    const matches = matchCount(userScores, draw.drawn_numbers);

    if (matches >= 3) {
      const matchType = String(matches >= 5 ? 5 : matches);
      const poolField = matchType === '5' ? draw.pool_5 : matchType === '4' ? draw.pool_4 : draw.pool_3;

      winners.push({
        draw_id: draw.id,
        user_id: user.id,
        match_type: matchType,
        amount: poolField,
      });
    }
  }

  if (winners.length > 0) {
    const { error: winnersError } = await supabaseAdmin.from('winners').insert(winners);
    if (winnersError) throw winnersError;
  } else {
    const { error: rolloverError } = await supabaseAdmin
      .from('draws')
      .update({ jackpot_rollover: draw.pool_5 })
      .eq('id', draw.id);

    if (rolloverError) throw rolloverError;
  }

  return { draw, winners };
}