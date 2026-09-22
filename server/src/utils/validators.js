import Joi from 'joi';

export const scoreSchema = Joi.object({
  score: Joi.number().integer().min(1).max(45).required(),
  score_date: Joi.date().required(),
});

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const charitySelectionSchema = Joi.object({
  charity_id: Joi.string().uuid().required(),
  charity_contribution_pct: Joi.number().min(10).max(100).required(),
});

export const subscriptionSchema = Joi.object({
  plan: Joi.string().valid('monthly', 'yearly').required(),
});

export const drawConfigSchema = Joi.object({
  draw_month: Joi.date().required(),
  mode: Joi.string().valid('random', 'algorithmic').required(),
});

export const winnerVerificationSchema = Joi.object({
  verification_status: Joi.string().valid('approved', 'rejected').required(),
});

export const payoutSchema = Joi.object({
  payment_status: Joi.string().valid('paid').required(),
});