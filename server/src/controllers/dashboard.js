import { supabaseAdmin } from '../config/supabase.js';

export async function getDashboardSummary(
  req,
  res,
  next,
) {
  try {
    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        selected_charity_id,
        charities (
          id,
          name,
          description,
          image_url
        )
      `)
      .eq('id', req.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const {
      data: subscription,
      error: subscriptionError,
    } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      throw subscriptionError;
    }

    const {
      data: scores,
      error: scoreError,
    } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', req.user.id)
      .order('score_date', {
        ascending: false,
      })
      .limit(5);

    if (scoreError) {
      throw scoreError;
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const {
      data: upcomingDraw,
      error: upcomingError,
    } = await supabaseAdmin
      .from('draws')
      .select('*')
      .in('status', [
        'draft',
        'simulated',
      ])
      .gte('draw_month', today)
      .order('draw_month', {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (upcomingError) {
      throw upcomingError;
    }

    const {
      data: winnings,
      error: winningsError,
    } = await supabaseAdmin
      .from('winners')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', {
        ascending: false,
      });

    if (winningsError) {
      throw winningsError;
    }

    let drawsEntered = 0;

    if (subscription?.status === 'active') {
      const {
        count,
        error: drawError,
      } = await supabaseAdmin
        .from('draws')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'published')
        .gte(
          'created_at',
          subscription.created_at,
        );

      if (drawError) {
        throw drawError;
      }

      drawsEntered = count || 0;
    }

    const totalWon = (
      winnings || []
    ).reduce(
      (sum, winner) =>
        sum + Number(winner.amount || 0),
      0,
    );

    const pendingWinnings = (
      winnings || []
    )
      .filter(
        (winner) =>
          winner.payment_status !== 'paid',
      )
      .reduce(
        (sum, winner) =>
          sum + Number(winner.amount || 0),
        0,
      );

    const paidWinnings = (
      winnings || []
    )
      .filter(
        (winner) =>
          winner.payment_status === 'paid',
      )
      .reduce(
        (sum, winner) =>
          sum + Number(winner.amount || 0),
        0,
      );

    res.json({
      profile,
      subscription:
        subscription || null,
      scores: scores || [],
      charity:
        profile?.charities || null,
      participation: {
        drawsEntered,
        upcomingDraw:
          upcomingDraw || null,
      },
      winnings: winnings || [],
      totalWon,
      paidWinnings,
      pendingWinnings,
    });
  } catch (error) {
    next(error);
  }
}