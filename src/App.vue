<template>
  <div class="app">
    <Toolbar
      v-model:channel="channel"
      v-model:mode="mode"
      v-model:edition="edition"
      :isRunning="isRunning"
      :isSaving="isSaving"
      :dark="isDark"
      :blockId="blockId"
      @run="runCode"
      @format="formatCode"
      @clippy="clippyCode"
      @save-gist="saveGist"
      @toggle-theme="toggleTheme"
    />
    <Editor v-model="code" :dark="isDark" @run="runCode" />
    <Output :output="output" :error="error" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import Editor from './components/Editor.vue'
import Toolbar from './components/Toolbar.vue'
import Output from './components/Output.vue'
import { usePlayground } from './composables/usePlayground.js'
import { useGist } from './composables/useGist.js'
import { getBlockIdFromSearch, createScopedStorageKey } from './composables/playgroundIdentity.js'

const params = new URLSearchParams(window.location.search)
const DEFAULT_CODE = `fn main() {\n    println!("Hello, world!");\n}`
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://play.rust-lang.org'
const blockId = getBlockIdFromSearch(window.location.search)

const storageKey = computed(() => createScopedStorageKey('feishu-rust-playground-code', blockId))
const themeKey = computed(() => createScopedStorageKey('feishu-rust-playground-theme', blockId))

const code = ref(DEFAULT_CODE)
const channel = ref('stable')
const mode = ref('debug')
const edition = ref('2021')
const isDark = ref(true)

const { execute, format, clippy, output, error, isRunning } = usePlayground(PROXY_URL)
const { saveToGist, loadFromGist, isSaving } = useGist()

onMounted(async () => {
  const savedTheme = localStorage.getItem(themeKey.value)
  if (savedTheme) isDark.value = savedTheme === 'dark'
  applyTheme()

  const saved = localStorage.getItem(storageKey.value)
  if (saved) code.value = saved

  const gistId = params.get('gist')
  if (gistId) {
    const gistCode = await loadFromGist(gistId)
    if (gistCode) code.value = gistCode
  }
})

watch(code, (val) => {
  localStorage.setItem(storageKey.value, val)
})

function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem(themeKey.value, isDark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

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
  if (url) alert(`\u5df2\u4fdd\u5b58\uff01Gist \u94fe\u63a5: ${url}`)
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
