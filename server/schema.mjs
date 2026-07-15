import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { query, listRows } from './db.mjs'

async function runMigration(file) {
  const sql = readFileSync(fileURLToPath(new URL(`./migrations/${file}`, import.meta.url)), 'utf8')
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('--'))
  for (const stmt of statements) {
    await query(stmt)
  }
}

export async function initDb() {
  await runMigration('001_create_tables.sql')
  if ((await listRows('funcionarios')).length === 0) {
    await runMigration('002_seed.sql')
  }
}
