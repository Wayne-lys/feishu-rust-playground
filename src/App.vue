<template>
  <div class="app">
    <Toolbar
      v-model:channel="channel"
      v-model:mode="mode"
      v-model:edition="edition"
      :isRunning="isRunning"
      :isSaving="isSaving"
      @run="runCode"
      @format="formatCode"
      @clippy="clippyCode"
      @save-gist="saveGist"
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
import { useGist } from './composables/useGist.js'

const STORAGE_KEY = 'feishu-rust-playground-code'
const DEFAULT_CODE = `fn main() {\n    println!("Hello, world!");\n}`
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://play.rust-lang.org'

const code = ref(DEFAULT_CODE)
const channel = ref('stable')
const mode = ref('debug')
const edition = ref('2021')

const { execute, format, clippy, output, error, isRunning } = usePlayground(PROXY_URL)
const { saveToGist, loadFromGist, isSaving, gistError } = useGist()

onMounted(async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) code.value = saved

  const gistId = new URLSearchParams(window.location.search).get('gist')
  if (gistId) {
    const gistCode = await loadFromGist(gistId)
    if (gistCode) code.value = gistCode
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

async function saveGist() {
  const url = await saveToGist(code.value)
  if (url) alert(`Saved! Gist URL: ${url}`)
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
