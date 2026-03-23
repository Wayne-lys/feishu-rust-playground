import { ref } from 'vue'

export function usePlayground(proxyUrl) {
  const output = ref(null)
  const error = ref(null)
  const isRunning = ref(false)

  async function execute(code, { channel = 'stable', mode = 'debug', edition = '2021' } = {}) {
    isRunning.value = true
    error.value = null
    output.value = null

    try {
      const res = await fetch(`${proxyUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          mode,
          edition,
          crateType: 'bin',
          tests: false,
          code,
          backtrace: false
        })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      output.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isRunning.value = false
    }
  }

  async function format(code) {
    try {
      const res = await fetch(`${proxyUrl}/format`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, edition: '2021' })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      return data.success ? data.code : null
    } catch (e) {
      error.value = e.message
      return null
    }
  }

  async function clippy(code, { edition = '2021' } = {}) {
    isRunning.value = true
    error.value = null
    output.value = null

    try {
      const res = await fetch(`${proxyUrl}/clippy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'nightly',
          crateType: 'bin',
          edition,
          code
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      output.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      isRunning.value = false
    }
  }

  return { execute, format, clippy, output, error, isRunning }
}
