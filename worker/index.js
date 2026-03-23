const PLAYGROUND = 'https://play.rust-lang.org'
const ALLOWED_PATHS = ['/execute', '/format', '/clippy', '/miri', '/macro.expansion']

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      })
    }

    const url = new URL(request.url)

    if (request.method !== 'POST' || !ALLOWED_PATHS.includes(url.pathname)) {
      return new Response('Not Found', { status: 404, headers: corsHeaders() })
    }

    const body = await request.text()
    const resp = await fetch(`${PLAYGROUND}${url.pathname}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    })

    const data = await resp.text()
    return new Response(data, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders()
      }
    })
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}
