import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
})

const snakize = (s) =>
  s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())

const toSnake = (obj) => {
  const out = {}
  for (const [k, v] of Object.entries(obj ?? {})) out[snakize(k)] = v
  return out
}

const serialize = (v) => (v && typeof v === 'object' ? JSON.stringify(v) : v)

const toCamel = (rows) =>
  (Array.isArray(rows) ? rows : [rows]).map((row) => {
    const out = {}
    for (const [k, v] of Object.entries(row)) {
      out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v
    }
    return out
  })

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function listRows(table) {
  const rows = await query(`SELECT * FROM \`${table}\` ORDER BY id`)
  return toCamel(rows)
}

export async function getRow(table, id) {
  const rows = await query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id])
  if (!rows.length) return null
  return toCamel(rows)[0]
}

export async function insertRow(table, payload) {
  const data = toSnake(payload)
  const cols = Object.keys(data)
  const vals = Object.values(data).map(serialize)
  const sql = `INSERT INTO \`${table}\` (${cols
    .map((c) => `\`${c}\``)
    .join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
  const [res] = await pool.query(sql, vals)
  const id = data.id ?? res.insertId
  return getRow(table, id)
}

export async function updateRow(table, id, payload) {
  const data = toSnake(payload)
  const cols = Object.keys(data)
  if (!cols.length) return getRow(table, id)
  const sql = `UPDATE \`${table}\` SET ${cols.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`
  await pool.query(sql, [...Object.values(data).map(serialize), id])
  return getRow(table, id)
}

export async function deleteRow(table, id) {
  await pool.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id])
}

export default pool
