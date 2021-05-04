import express from 'express'
import { NextFunction, Request, Response } from 'express'
import db from './db'
import { createHash } from 'crypto'

const app = express()

app.use(express.json())

app.get('/', (_, res) => res.send({ status: 'ok', app: 'cross-browser-cookie' }))

app.post('/add', async (req, res) => {
  const { fingerprint, visitorId, apps } = req.body

  const validationError = { error: true, added: false }

  if (!fingerprint || fingerprint.length === 0) {
    res.send({ ...validationError, message: 'fingerprint is required' })
    return
  }

  if (!visitorId || visitorId.length === 0) {
    res.send({ ...validationError, message: 'visitorId is required' })
    return
  }

  if (!Array.isArray(apps)) {
    res.send({ ...validationError, message: 'apps must be an array' })
    return
  }

  const sortedApps = apps.sort()
  const hash = createHash('sha256')
  const hashRes = hash.update(sortedApps.join('')).digest('base64')

  let count = 0
  try {
    const { rows } = await db.query('SELECT COUNT(*) FROM statistics WHERE hash = $1', [hashRes])

    count = rows[0].count

    await db.query('INSERT INTO statistics (fingerprint, visitorId, apps, hash) VALUES ($1, $2, $3, $4)', [
      fingerprint,
      visitorId,
      JSON.stringify(sortedApps),
      hashRes,
    ])
  } catch (e) {
    res.send({ added: false, error: true, message: 'DB error' })
    console.error(e)
    return
  }

  res.send({ added: true, count })
})

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.send({ error: true })
  next(err)
})

export default app
