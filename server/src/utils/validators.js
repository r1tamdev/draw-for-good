import Joi from 'joi';

export const scoreSchema = Joi.object({
  score: Joi.number()
    .integer()
    .min(1)
    .max(45)
    .required(),

  score_date: Joi.date()
    .required(),
});

export const signupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  full_name: Joi.string()
    .trim()
    .required(),

  charity_id: Joi.string()
    .uuid()
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

export const charitySelectionSchema = Joi.object({
  charity_id: Joi.string()
    .uuid()
    .required(),
});

export const subscriptionSchema = Joi.object({
  plan: Joi.string()
    .valid('monthly', 'yearly')
    .required(),
});

export const drawConfigSchema = Joi.object({
  draw_month: Joi.date()
    .required(),

  mode: Joi.string()
    .valid('random', 'algorithmic')
    .required(),
});

export const winnerVerificationSchema = Joi.object({
  verification_status: Joi.string()
    .valid(
      'approved',
      'rejected',
    )
    .required(),
});

export const payoutSchema = Joi.object({
  payment_status: Joi.string()
    .valid('paid')
    .required(),
});

export const profileUpdateSchema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(1)
    .required(),

  role: Joi.string()
    .valid(
      'subscriber',
      'admin',
    )
    .required(),
});

export const adminSubscriptionSchema = Joi.object({
  plan: Joi.string()
    .valid(
      'monthly',
      'yearly',
    )
    .required(),

  status: Joi.string()
    .valid(
      'active',
      'inactive',
      'cancelled',
      'lapsed',
    )
    .required(),

  current_period_end:
    Joi.date()
      .allow(null, '')
      .optional(),

  cancel_at_period_end:
    Joi.boolean()
      .optional(),
});