<template>
  <div class="output-panel">
    <div class="output-header">Output</div>
    <pre class="output-content" v-if="output">
      <span v-if="output.stderr" class="stderr">{{ output.stderr }}</span>
      <span v-if="output.stdout" class="stdout">{{ output.stdout }}</span>
      <span v-if="!output.stdout && !output.stderr" class="no-output">(no output)</span>
    </pre>
    <pre class="output-content error" v-else-if="error">Error: {{ error }}</pre>
    <pre class="output-content placeholder" v-else>Click "Run" or press Ctrl+Enter to execute your code.</pre>
  </div>
</template>

<script setup>
defineProps({
  output: { type: Object, default: null },
  error: { type: String, default: null }
})
</script>

<style scoped>
.output-panel {
  border-top: 1px solid #3a3a3a;
  background: #1a1a1a;
}
.output-header {
  padding: 6px 12px;
  font-size: 12px;
  color: #888;
  background: #1e1e1e;
  border-bottom: 1px solid #3a3a3a;
}
.output-content {
  margin: 0;
  padding: 12px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 13px;
  color: #ccc;
  min-height: 80px;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
}
.stderr { color: #f97583; }
.stdout { color: #adbac7; }
.error { color: #f97583; }
.placeholder { color: #555; }
.no-output { color: #555; font-style: italic; }
</style>
