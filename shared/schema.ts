import { z } from "zod";

export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  totalScore: z.number().default(0),
  roundsPlayed: z.number().default(0),
});

export const roundSchema = z.object({
  id: z.string(),
  number: z.number(),
  scores: z.record(z.string(), z.number()), // playerId -> score
  timestamp: z.number(),
});

export const gameSchema = z.object({
  id: z.string(),
  name: z.string(),
  players: z.array(playerSchema),
  rounds: z.array(roundSchema),
  currentRound: z.number().default(0),
  startTime: z.number(),
  endTime: z.number().optional(),
});

export const insertPlayerSchema = playerSchema.omit({ id: true, totalScore: true, roundsPlayed: true });
export const insertRoundSchema = roundSchema.omit({ id: true, timestamp: true });
export const insertGameSchema = gameSchema.omit({ id: true, startTime: true });

export type Player = z.infer<typeof playerSchema>;
export type Round = z.infer<typeof roundSchema>;
export type Game = z.infer<typeof gameSchema>;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertRound = z.infer<typeof insertRoundSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
