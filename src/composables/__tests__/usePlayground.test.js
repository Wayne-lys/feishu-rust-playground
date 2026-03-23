import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePlayground } from '../usePlayground.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('usePlayground', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('sends correct request to /execute and returns result', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        stdout: 'Hello\n',
        stderr: ''
      })
    })

    const { execute, output, isRunning } = usePlayground('https://proxy.example.com')
    expect(isRunning.value).toBe(false)

    await execute('fn main() { println!("Hello"); }', {
      channel: 'stable',
      mode: 'debug',
      edition: '2021'
    })

    expect(mockFetch).toHaveBeenCalledWith('https://proxy.example.com/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'stable',
        mode: 'debug',
        edition: '2021',
        crateType: 'bin',
        tests: false,
        code: 'fn main() { println!("Hello"); }',
        backtrace: false
      })
    })

    expect(output.value).toEqual({
      success: true,
      stdout: 'Hello\n',
      stderr: ''
    })
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { execute, output, error } = usePlayground('https://proxy.example.com')
    await execute('fn main() {}', { channel: 'stable', mode: 'debug', edition: '2021' })

    expect(error.value).toBe('Network error')
  })
})
