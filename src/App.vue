<template>
  <div class="app">
    <Toolbar
      v-model:channel="channel"
      v-model:mode="mode"
      v-model:edition="edition"
      :isRunning="isRunning"
      @run="runCode"
      @format="formatCode"
      @clippy="clippyCode"
    />
    <Editor v-model="code" @run="runCode" />
    <Output :output="output" :error="error" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Editor from './components/Editor.vue'
import Toolbar from './components/Toolbar.vue'
import Output from './components/Output.vue'
import { usePlayground } from './composables/usePlayground.js'

const STORAGE_KEY = 'feishu-rust-playground-code'
const DEFAULT_CODE = `fn main() {\n    println!("Hello, world!");\n}`
const PROXY_URL = import.meta.env.VITE_PROXY_URL || ''

const code = ref(DEFAULT_CODE)
const channel = ref('stable')
const mode = ref('debug')
const edition = ref('2021')

const { execute, format, clippy, output, error, isRunning } = usePlayground(PROXY_URL)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) code.value = saved

  const gistId = new URLSearchParams(window.location.search).get('gist')
  if (gistId) {
    loadGist(gistId)
  }
})

watch(code, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
})

async function runCode() {
  await execute(code.value, {
    channel: channel.value,
    mode: mode.value,
    edition: edition.value
  })
}

async function formatCode() {
  const formatted = await format(code.value)
  if (formatted) code.value = formatted
}

async function clippyCode() {
  await clippy(code.value, { edition: edition.value })
}

async function loadGist(id) {
  try {
    const res = await fetch(`https://api.github.com/gists/${id}`)
    if (!res.ok) return
    const data = await res.json()
    const files = Object.values(data.files)
    const rustFile = files.find(f => f.filename.endsWith('.rs')) || files[0]
    if (rustFile) code.value = rustFile.content
  } catch (e) {
    console.error('Failed to load gist:', e)
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
