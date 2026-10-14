// src/lib/schema.ts
import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const TransactionSchema = z
  .object({
    id: z.string().min(1).max(64),
    type: z.enum(['income', 'expense']),
    amountMinor: z.number().int().nonnegative().max(100_000_000_000),
    category: z.string().trim().min(1).max(40),
    description: z.string().trim().max(200).default(''),
    date: z.string().regex(dateRegex, 'Tarih YYYY-MM-DD olmalı'),
    createdAt: z.string().min(1).max(40),
  })
  .strict();

export const RecurringSchema = z
  .object({
    id: z.string().min(1).max(64),
    type: z.enum(['income', 'expense']),
    amountMinor: z.number().int().nonnegative().max(100_000_000_000),
    category: z.string().trim().min(1).max(40),
    description: z.string().trim().max(200).default(''),
    dayOfMonth: z.number().int().min(1).max(28),
    active: z.boolean(),
    lastAppliedMonth: z.string().max(7),
  })
  .strict();

export const StoredStateSchema = z.object({
  schemaVersion: z.number().int().positive(),
  transactions: z.array(TransactionSchema).max(50_000),
  recurring: z.array(RecurringSchema).max(500).default([]),
  betaAccepted: z.boolean().default(false),
  lastExportAt: z.string().nullable().default(null),
});

export const ImportPayloadSchema = z.object({
  schemaVersion: z.number().int().positive(),
  transactions: z.array(TransactionSchema).max(50_000),
  recurring: z.array(RecurringSchema).max(500).default([]),
});
