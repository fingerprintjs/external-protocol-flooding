export async function wait(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
