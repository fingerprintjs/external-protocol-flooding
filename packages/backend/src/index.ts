import { performance } from 'perf_hooks'
import express from 'express'
import { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { Pool } from 'pg'

const defaultDatabaseUrl = 'postgres://localhost/schemeflood'

const dbPool = new Pool({
  max: 25,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 30_000,
  query_timeout: 20_000,
  connectionString: process.env.DATABASE_URL || defaultDatabaseUrl
})
const app = express()

app.use(express.json())
app.use(cors())


app.get('/', (_, res) => res.send({ ok: true, msg: 'backend API, nothing to do here, move on' }))

app.post('/app_hashes', async (req, res) => {
  const { visitorId, appHash } = req.body

  if (!appHash || appHash.length === 0) {
    const err = 'appHash value is required' 
    console.warn(err)
    res.status(422).send({ ok: false, error: err})
    return
  }

  let count = 0
  let totalCount = 0

  try {
    const startedTimestamp = performance.now()
    let result =
      await dbPool.query('SELECT COUNT(1) as count FROM app_hashes WHERE app_hash = $1', [appHash])

    count = result.rows[0].count

    result = await dbPool.query('SELECT COUNT(id) as count FROM app_hashes')
    totalCount = result.rows[0].count

    await dbPool.query('INSERT INTO app_hashes (visitor_id, app_hash) VALUES ($1, $2)', [
      visitorId,
      appHash,
    ])
    const duration = Math.round(performance.now() - startedTimestamp)
    res.status(202).send({ ok: true, duration: `${duration}ms`, count, totalCount })
  } catch (e) {
    console.error(e)
    res.status(422).send({ ok: false, error: 'Failed to add appHash' })
  }
})

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.send({ ok: false, error: 'Server error, please try again' })
  next(err)
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`backend listening on port ${port}`)
})
