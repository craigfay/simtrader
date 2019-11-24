/**
 * Create validators for the interfaces of key data
 */

import { schema, string, integer, float } from '@lepton/schema';

export const actor = schema(
  float('cash').positive().notNull(),
  string('key').alphanumeric().minLength(32).maxLength(32).notNull(),
);

export const position = schema(
  string('actorId').alphanumeric().notNull(),
  string('timestamp').must(beDateString)().notNull(),
  string('action').enumerated('buy', 'sell'),
  string('symbol').notNull(),
  integer('quantity').positive().notNull(),
  float('price').positive().notNull(),
);

function beDateString() {
  return function(name, val) {
    if (new Date(val).toISOString() !== val)
    throw new Error(`${name} must be a valid ISO date string.`)
  }
}
