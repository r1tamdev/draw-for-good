import { supabaseAdmin } from '../config/supabase.js';

export async function requireActiveSub(req, res, next) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data || data.status !== 'active') {
    return res.status(403).json({ error: 'Active subscription required' });
  }

  next();
}