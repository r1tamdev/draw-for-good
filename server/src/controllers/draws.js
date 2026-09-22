import { simulateDraw, publishDraw } from '../services/drawEngine.js';
import { supabaseAdmin } from '../config/supabase.js';
import { drawConfigSchema } from '../utils/validators.js';

export async function simulate(req, res, next) {
  try {
    const { error: validationError, value } = drawConfigSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const result = await simulateDraw(value.draw_month, value.mode);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function publish(req, res, next) {
  try {
    const result = await publishDraw(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listDraws(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getUpcomingDraw(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('status', 'draft')
      .order('draw_month', { ascending: true })
      .limit(1)
      .single();

    if (error) return res.status(404).json({ error: 'No upcoming draw' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}