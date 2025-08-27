try {
  const source = new EventSource('/reload')

  source.onmessage = (event) => {
    if (event.data === 'reload') location.reload()
  }
} catch (error) {
  return
}
