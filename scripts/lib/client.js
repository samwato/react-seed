(function() {
  const eventSource = new EventSource('sse')
  eventSource.addEventListener('message', function({ data }) {
    if (data === 'refresh') {
      window.location.reload()
    }
  })
}())