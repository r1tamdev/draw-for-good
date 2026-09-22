import { supabaseAdmin } from '../config/supabase.js';
import { winnerVerificationSchema, payoutSchema } from '../utils/validators.js';

export async function listMyWinnings(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('winners')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function uploadProof(req, res, next) {
  try {
    const { proof_url } = req.body;

    const { data, error } = await supabaseAdmin
      .from('winners')
      .update({ proof_url })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listAllWinners(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('winners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function verifyWinner(req, res, next) {
  try {
    const { error: validationError, value } = winnerVerificationSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const { data, error } = await supabaseAdmin
      .from('winners')
      .update({ verification_status: value.verification_status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function markPaid(req, res, next) {
  try {
    const { error: validationError, value } = payoutSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const { data, error } = await supabaseAdmin
      .from('winners')
      .update({ payment_status: value.payment_status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}