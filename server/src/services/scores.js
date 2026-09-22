import { supabaseAdmin } from '../config/supabase.js';

export async function addScore(userId, score, scoreDate) {
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('scores')
    .select('id, score_date')
    .eq('user_id', userId)
    .order('score_date', { ascending: true });

  if (fetchError) throw fetchError;

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('scores')
    .insert({ user_id: userId, score, score_date: scoreDate })
    .select()
    .single();

  if (insertError) throw insertError;

  const updatedList = [...existing, inserted].sort(
    (a, b) => new Date(a.score_date) - new Date(b.score_date)
  );

  if (updatedList.length > 5) {
    const toDelete = updatedList.slice(0, updatedList.length - 5);
    const idsToDelete = toDelete.map((s) => s.id);

    const { error: deleteError } = await supabaseAdmin
      .from('scores')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) throw deleteError;
  }

  return inserted;
}

export async function getScores(userId) {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .order('score_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateScore(userId, scoreId, score) {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .update({ score })
    .eq('id', scoreId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteScore(userId, scoreId) {
  const { error } = await supabaseAdmin
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId);

  if (error) throw error;
}