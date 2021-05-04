import app from './app'

const port = process.env.BACKEND_PORT ?? 3000

app.listen(port, () => {
  console.log(`cross-browser-cookie is up, listening on port ${port}`)
})
