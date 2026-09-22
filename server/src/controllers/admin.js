import { supabaseAdmin } from '../config/supabase.js';

export async function listUsers(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
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

export async function updateUserSubscription(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(req.body)
      .eq('user_id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getReports(req, res, next) {
  try {
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { data: draws } = await supabaseAdmin
      .from('draws')
      .select('total_pool')
      .eq('status', 'published');

    const totalPool = (draws || []).reduce((sum, d) => sum + Number(d.total_pool || 0), 0);

    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('charity_contribution_pct');

    const avgCharityPct =
      subscriptions && subscriptions.length > 0
        ? subscriptions.reduce((sum, s) => sum + Number(s.charity_contribution_pct), 0) / subscriptions.length
        : 0;

    const { count: totalDraws } = await supabaseAdmin
      .from('draws')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    res.json({
      totalUsers: totalUsers || 0,
      totalPool,
      avgCharityContributionPct: avgCharityPct,
      totalDraws: totalDraws || 0,
    });
  } catch (err) {
    next(err);
  }
}