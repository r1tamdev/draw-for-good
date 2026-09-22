import { env } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import {
  adminSubscriptionSchema,
  profileUpdateSchema,
} from '../utils/validators.js';

export async function listUsers(req, res, next) {
  try {
    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .select('*, subscriptions(*)')
        .order('created_at', {
          ascending: false,
        });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req,
  res,
  next,
) {
  try {
    const {
      error: validationError,
      value,
    } = profileUpdateSchema.validate(
      req.body,
    );

    if (validationError) {
      return res.status(400).json({
        error: validationError.message,
      });
    }

    const { data, error } =
      await supabaseAdmin
        .from('profiles')
        .update(value)
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function updateUserSubscription(
  req,
  res,
  next,
) {
  try {
    const {
      error: validationError,
      value,
    } = adminSubscriptionSchema.validate(
      req.body,
    );

    if (validationError) {
      return res.status(400).json({
        error: validationError.message,
      });
    }

    const { data: existing, error: findError } =
      await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', req.params.id)
        .order('created_at', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (findError) throw findError;

    let data;
    let error;

    if (existing) {
      ({
        data,
        error,
      } = await supabaseAdmin
        .from('subscriptions')
        .update(value)
        .eq('id', existing.id)
        .select()
        .single());
    } else {
      ({
        data,
        error,
      } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: req.params.id,
          ...value,
        })
        .select()
        .single());
    }

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getReports(
  req,
  res,
  next,
) {
  try {
    const {
      count: totalUsers,
    } = await supabaseAdmin
      .from('profiles')
      .select('*', {
        count: 'exact',
        head: true,
      });

    const { data: draws } =
      await supabaseAdmin
        .from('draws')
        .select('total_pool')
        .eq('status', 'published');

    const totalPool =
      (draws || []).reduce(
        (sum, draw) =>
          sum +
          Number(draw.total_pool || 0),
        0,
      );

    const { count: totalDraws } =
      await supabaseAdmin
        .from('draws')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'published');

    const { data: activeSubscriptions } =
      await supabaseAdmin
        .from('subscriptions')
        .select(
          'charity_contribution_pct, plan',
        )
        .eq('status', 'active');

    const active =
      activeSubscriptions || [];

    const averageContribution =
      active.length
        ? active.reduce(
            (sum, item) =>
              sum +
              Number(
                item.charity_contribution_pct ||
                  0,
              ),
            0,
          ) / active.length
        : 0;

    const charityContributionTotal =
      active.reduce(
        (sum, item) => {
          const value =
            item.plan === 'yearly'
              ? env.yearlySubscriptionValue
              : env.monthlySubscriptionValue;

          return (
            sum +
            value *
              (Number(
                item.charity_contribution_pct ||
                  0,
              ) /
                100)
          );
        },
        0,
      );

    res.json({
      totalUsers:
        totalUsers || 0,

      totalPool,

      totalDraws:
        totalDraws || 0,

      activeSubscribers:
        active.length,

      charityContributionTotal,
    });
  } catch (error) {
    next(error);
  }
}