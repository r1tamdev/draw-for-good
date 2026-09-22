import { supabaseAdmin } from '../config/supabase.js';
import {
  winnerVerificationSchema,
  payoutSchema,
} from '../utils/validators.js';

export async function listMyWinnings(
  req,
  res,
  next,
) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from('winners')
        .select(`
          *,
          draws (
            draw_month,
            drawn_numbers
          )
        `)
        .eq('user_id', req.user.id)
        .order('created_at', {
          ascending: false,
        });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

export async function uploadProof(
  req,
  res,
  next,
) {
  try {
    const {
      proof_url,
    } = req.body;

    if (!proof_url) {
      return res.status(400).json({
        error: 'Proof URL is required',
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from('winners')
        .update({
          proof_url,
        })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .eq(
          'verification_status',
          'pending',
        )
        .select()
        .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getProofUrl(
  req,
  res,
  next,
) {
  try {
    const {
      data: winner,
      error,
    } = await supabaseAdmin
      .from('winners')
      .select(
        'proof_url, user_id',
      )
      .eq('id', req.params.id)
      .single();

    if (
      error ||
      !winner?.proof_url
    ) {
      return res.status(404).json({
        error: 'Proof not found',
      });
    }

    if (
      winner.user_id !== req.user.id
    ) {
      const { data: profile } =
        await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq(
            'id',
            req.user.id,
          )
          .single();

      if (
        profile?.role !== 'admin'
      ) {
        return res.status(403).json({
          error: 'Forbidden',
        });
      }
    }

    res.json({
      url: winner.proof_url,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAllWinners(
  req,
  res,
  next,
) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from('winners')
        .select(`
          *,
          profiles (
            full_name
          ),
          draws (
            draw_month,
            drawn_numbers
          )
        `)
        .order('created_at', {
          ascending: false,
        });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

export async function verifyWinner(
  req,
  res,
  next,
) {
  try {
    const {
      error: validationError,
      value,
    } =
      winnerVerificationSchema.validate(
        req.body,
      );

    if (validationError) {
      return res.status(400).json({
        error:
          validationError.message,
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from('winners')
        .update({
          verification_status:
            value.verification_status,
        })
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function markPaid(
  req,
  res,
  next,
) {
  try {
    const {
      error: validationError,
      value,
    } =
      payoutSchema.validate(req.body);

    if (validationError) {
      return res.status(400).json({
        error:
          validationError.message,
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from('winners')
        .update({
          payment_status:
            value.payment_status,
        })
        .eq('id', req.params.id)
        .eq(
          'verification_status',
          'approved',
        )
        .select()
        .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
}