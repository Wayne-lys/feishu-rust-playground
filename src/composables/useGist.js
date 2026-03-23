import { ref } from 'vue'

export function useGist() {
  const isSaving = ref(false)
  const gistError = ref(null)

  async function saveToGist(code, description = 'Rust code from Feishu Playground') {
    isSaving.value = true
    gistError.value = null

    try {
      const token = localStorage.getItem('github-token')
      if (!token) {
        const input = prompt('Enter your GitHub Personal Access Token (with gist scope):')
        if (!input) return null
        localStorage.setItem('github-token', input)
        return saveToGist(code, description)
      }

      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`
        },
        body: JSON.stringify({
          description,
          public: false,
          files: { 'main.rs': { content: code } }
        })
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('github-token')
          throw new Error('Invalid token, please try again')
        }
        throw new Error(`GitHub API error: ${res.status}`)
      }

      const data = await res.json()
      const url = new URL(window.location)
      url.searchParams.set('gist', data.id)
      window.history.replaceState({}, '', url)

      return data.html_url
    } catch (e) {
      gistError.value = e.message
      return null
    } finally {
      isSaving.value = false
    }
  }

  async function loadFromGist(gistId) {
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`)
      if (!res.ok) throw new Error(`Failed to load gist: ${res.status}`)
      const data = await res.json()
      const files = Object.values(data.files)
      const rustFile = files.find(f => f.filename.endsWith('.rs')) || files[0]
      return rustFile ? rustFile.content : null
    } catch (e) {
      gistError.value = e.message
      return null
    }
  }

  return { saveToGist, loadFromGist, isSaving, gistError }
}
