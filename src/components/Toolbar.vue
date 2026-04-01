<template>
  <div class="toolbar">
    <button class="btn btn-run" @click="$emit('run')" :disabled="isRunning">
      {{ isRunning ? '运行中...' : '▶ 运行' }}
    </button>
    <button class="btn" @click="$emit('format')" :disabled="isRunning">格式化</button>
    <button class="btn" @click="$emit('clippy')" :disabled="isRunning">Clippy</button>
    <button class="btn" @click="$emit('save-gist')" :disabled="isSaving">
      {{ isSaving ? '保存中...' : '保存 Gist' }}
    </button>

    <select v-model="channelModel">
      <option value="stable">Stable</option>
      <option value="beta">Beta</option>
      <option value="nightly">Nightly</option>
    </select>

    <select v-model="modeModel">
      <option value="debug">Debug</option>
      <option value="release">Release</option>
    </select>

    <select v-model="editionModel">
      <option value="2021">2021</option>
      <option value="2024">2024</option>
      <option value="2018">2018</option>
    </select>

    <button class="btn btn-theme" @click="$emit('toggle-theme')" :title="dark ? '切换亮色' : '切换暗色'">
      {{ dark ? '☀️' : '🌙' }}
    </button>

    <input
      class="block-name-input"
      :value="blockName"
      @change="$emit('update:blockName', $event.target.value.trim())"
      placeholder="代码块名称"
      title="给代码块起个名字，多个块的代码独立保存"
    />

    <span class="shortcut-hint">Ctrl+Enter 运行</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  channel: { type: String, default: 'stable' },
  mode: { type: String, default: 'debug' },
  edition: { type: String, default: '2021' },
  isRunning: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  dark: { type: Boolean, default: true },
  blockName: { type: String, default: '' }
})

const emit = defineEmits(['run', 'format', 'clippy', 'save-gist', 'toggle-theme', 'update:channel', 'update:mode', 'update:edition', 'update:blockName'])

const channelModel = computed({
  get: () => props.channel,
  set: (v) => emit('update:channel', v)
})
const modeModel = computed({
  get: () => props.mode,
  set: (v) => emit('update:mode', v)
})
const editionModel = computed({
  get: () => props.edition,
  set: (v) => emit('update:edition', v)
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-toolbar);
  border-bottom: 1px solid var(--border);
}
.btn {
  padding: 6px 16px;
  border: 1px solid var(--border-btn);
  border-radius: 4px;
  background: var(--bg-btn);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
}
.btn:hover { opacity: 0.8; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-run {
  background: #2ea043;
  border-color: #2ea043;
  color: #fff;
  font-weight: bold;
}
.btn-run:hover { background: #3fb950; }
.btn-theme {
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1;
}
.block-name-input {
  padding: 4px 8px;
  background: var(--bg-btn);
  color: var(--text);
  border: 1px solid var(--border-btn);
  border-radius: 4px;
  font-size: 13px;
  width: 120px;
}
select {
  padding: 4px 8px;
  background: var(--bg-btn);
  color: var(--text);
  border: 1px solid var(--border-btn);
  border-radius: 4px;
  font-size: 13px;
}
.shortcut-hint {
  margin-left: auto;
  color: var(--text-hint);
  font-size: 12px;
}
</style>
