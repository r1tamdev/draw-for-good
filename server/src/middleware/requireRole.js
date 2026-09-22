import { supabaseAdmin } from '../config/supabase.js';

export function requireRole(role) {
  return async (req, res, next) => {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'Profile not found' });
    }

    if (data.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.userRole = data.role;
    next();
  };
}