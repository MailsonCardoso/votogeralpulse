import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { listRows, getRow, insertRow, updateRow, deleteRow } from './db.mjs'
import { initDb } from './schema.mjs'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const RESOURCES = {
  funcionarios: 'funcionarios',
  liderancas: 'liderancas',
  cabos: 'cabos',
  eleitores: 'eleitores',
  visitas: 'visitas',
}

for (const [route, table] of Object.entries(RESOURCES)) {
  const base = `/api/${route}`

  app.get(base, async (_req, res) => {
    try {
      res.json(await listRows(table))
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.get(`${base}/:id`, async (req, res) => {
    try {
      const row = await getRow(table, req.params.id)
      if (!row) return res.status(404).json({ error: 'Não encontrado' })
      res.json(row)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.post(base, async (req, res) => {
    try {
      const created = await insertRow(table, req.body)
      res.status(201).json(created)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.put(`${base}/:id`, async (req, res) => {
    try {
      const updated = await updateRow(table, req.params.id, req.body)
      res.json(updated)
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })

  app.delete(`${base}/:id`, async (req, res) => {
    try {
      await deleteRow(table, req.params.id)
      res.status(204).end()
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}

const PORT = Number(process.env.PORT || 4000)

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API VotoGeral 360 rodando em http://localhost:${PORT}`)
    })
  })
  .catch((e) => {
    console.error('Falha ao inicializar o banco:', e.message)
    process.exit(1)
  })
