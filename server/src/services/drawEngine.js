import { supabaseAdmin } from '../config/supabase.js';
import {
  calculatePoolSplit,
  calculateTotalPool,
  getActiveSubscriptions,
} from './prizePool.js';

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

  for (const row of data || []) {
    frequency[row.score] = (frequency[row.score] || 0) + 1;
  }

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([score]) => Number(score))
    .filter((score) => score >= 1 && score <= max);

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
  return userScores.filter((score) => drawnNumbers.includes(score)).length;
}

export async function simulateDraw(drawMonth, mode) {
  const activeSubscriptions = await getActiveSubscriptions(supabaseAdmin);

  const totalPool = calculateTotalPool(activeSubscriptions);

  const { data: previousDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_rollover')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const rollover = Number(previousDraw?.jackpot_rollover || 0);

  const {
    pool5,
    pool4,
    pool3,
  } = calculatePoolSplit(totalPool, rollover);

  const drawnNumbers =
    mode === 'algorithmic'
      ? await generateAlgorithmicNumbers(5, 45)
      : generateRandomNumbers(5, 45);

  return {
    draw_month: drawMonth,
    mode,
    status: 'simulated',
    drawn_numbers: drawnNumbers,
    total_pool: Number(totalPool.toFixed(2)),
    pool_5: pool5,
    pool_4: pool4,
    pool_3: pool3,
    jackpot_rollover: rollover,
    participant_count: activeSubscriptions.length,
  };
}

export async function publishDraw(simulatedDraw) {
  if (
    !simulatedDraw?.draw_month ||
    !simulatedDraw?.mode ||
    !Array.isArray(simulatedDraw?.drawn_numbers)
  ) {
    throw new Error('A valid simulated draw is required before publishing');
  }

  const { data: existingDraw } = await supabaseAdmin
    .from('draws')
    .select('id')
    .eq('draw_month', simulatedDraw.draw_month)
    .eq('status', 'published')
    .maybeSingle();

  if (existingDraw) {
    throw new Error('A published draw already exists for this month');
  }

  const activeSubscriptions = await getActiveSubscriptions(supabaseAdmin);

  const totalPool = calculateTotalPool(activeSubscriptions);

  const { data: previousDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_rollover')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const rollover = Number(previousDraw?.jackpot_rollover || 0);

  const {
    pool5,
    pool4,
    pool3,
  } = calculatePoolSplit(totalPool, rollover);

  const drawPayload = {
    draw_month: simulatedDraw.draw_month,
    mode: simulatedDraw.mode,
    status: 'published',
    drawn_numbers: simulatedDraw.drawn_numbers,
    total_pool: Number(totalPool.toFixed(2)),
    pool_5: pool5,
    pool_4: pool4,
    pool_3: pool3,
    jackpot_rollover: 0,
    published_at: new Date().toISOString(),
  };

  const { data: draw, error: drawError } = await supabaseAdmin
    .from('draws')
    .insert(drawPayload)
    .select()
    .single();

  if (drawError) throw drawError;

  const winnersByTier = {
    '5': [],
    '4': [],
    '3': [],
  };

  for (const subscription of activeSubscriptions) {
    const { data: scores, error: scoreError } = await supabaseAdmin
      .from('scores')
      .select('score')
      .eq('user_id', subscription.user_id);

    if (scoreError) throw scoreError;

    if (!scores?.length) continue;

    const userScores = scores.map((row) => row.score);

    const matches = matchCount(
      userScores,
      draw.drawn_numbers,
    );

    if (matches >= 3) {
      const matchType = matches >= 5 ? '5' : String(matches);

      winnersByTier[matchType].push(subscription.user_id);
    }
  }

  const tierPools = {
    '5': Number(draw.pool_5 || 0),
    '4': Number(draw.pool_4 || 0),
    '3': Number(draw.pool_3 || 0),
  };

  const winners = [];

  for (const [matchType, userIds] of Object.entries(winnersByTier)) {
    if (!userIds.length) continue;

    const tierPool = tierPools[matchType];

    const amountPerWinner = Number(
      (tierPool / userIds.length).toFixed(2),
    );

    userIds.forEach((userId) => {
      winners.push({
        draw_id: draw.id,
        user_id: userId,
        match_type: matchType,
        amount: amountPerWinner,
      });
    });
  }

  const jackpotRollover =
    winnersByTier['5'].length === 0
      ? tierPools['5']
      : 0;

  if (winners.length > 0) {
    const { error: winnersError } = await supabaseAdmin
      .from('winners')
      .insert(winners);

    if (winnersError) throw winnersError;
  }

  if (jackpotRollover > 0) {
    const { error: rolloverError } = await supabaseAdmin
      .from('draws')
      .update({
        jackpot_rollover: Number(jackpotRollover.toFixed(2)),
      })
      .eq('id', draw.id);

    if (rolloverError) throw rolloverError;

    draw.jackpot_rollover = Number(
      jackpotRollover.toFixed(2),
    );
  }

  return {
    draw,
    winners,
    winnersByTier,
  };
}