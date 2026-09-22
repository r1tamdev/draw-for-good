import { supabaseAdmin } from '../config/supabase.js';
import { signupSchema, loginSchema } from '../utils/validators.js';

export async function signup(req, res, next) {
  try {
    const { error: validationError, value } =
      signupSchema.validate(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError.message,
      });
    }

    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email: value.email,
        password: value.password,
        email_confirm: true,
      });

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { error: profileError } =
      await supabaseAdmin.from('profiles').insert({
        id: data.user.id,
        full_name: value.full_name,
        role: 'subscriber',
        selected_charity_id: value.charity_id,
      });

    if (profileError) {
      return res.status(400).json({
        error: profileError.message,
      });
    }

    res.status(201).json({
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { error: validationError, value } =
      loginSchema.validate(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError.message,
      });
    }

    const { data, error } =
      await supabaseAdmin.auth.signInWithPassword(value);

    if (error) {
      return res.status(401).json({
        error: error.message,
      });
    }

    res.json({
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

    if (error) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}