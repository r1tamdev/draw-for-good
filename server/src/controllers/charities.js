import { supabaseAdmin } from '../config/supabase.js';
import { charitySelectionSchema } from '../utils/validators.js';

export async function listCharities(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin.from('charities').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCharity(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Charity not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function selectCharity(req, res, next) {
  try {
    const { error: validationError, value } = charitySelectionSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        charity_id: value.charity_id,
        charity_contribution_pct: value.charity_contribution_pct,
      })
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createCharity(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('charities')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateCharity(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('charities')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteCharity(req, res, next) {
  try {
    const { error } = await supabaseAdmin.from('charities').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}