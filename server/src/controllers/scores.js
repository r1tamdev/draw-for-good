import { addScore, getScores, updateScore, deleteScore } from '../services/scores.js';
import { scoreSchema } from '../utils/validators.js';

export async function createScore(req, res, next) {
  try {
    const { error: validationError, value } = scoreSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const result = await addScore(req.user.id, value.score, value.score_date);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listScores(req, res, next) {
  try {
    const scores = await getScores(req.user.id);
    res.json(scores);
  } catch (err) {
    next(err);
  }
}

export async function editScore(req, res, next) {
  try {
    const { error: validationError, value } = scoreSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const result = await updateScore(req.user.id, req.params.id, value.score);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function removeScore(req, res, next) {
  try {
    await deleteScore(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}