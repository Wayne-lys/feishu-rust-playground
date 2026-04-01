<template>
  <div class="output-panel">
    <div class="output-header">输出</div>
    <pre class="output-content" v-if="output">
      <span v-if="output.stderr" class="stderr">{{ output.stderr }}</span>
      <span v-if="output.stdout" class="stdout">{{ output.stdout }}</span>
      <span v-if="!output.stdout && !output.stderr" class="no-output">（无输出）</span>
    </pre>
    <pre class="output-content error" v-else-if="error">错误: {{ error }}</pre>
    <pre class="output-content placeholder" v-else>点击"运行"或按 Ctrl+Enter 执行代码</pre>
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
  border-top: 1px solid var(--border);
  background: var(--bg-secondary);
}
.output-header {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-toolbar);
  border-bottom: 1px solid var(--border);
}
.output-content {
  margin: 0;
  padding: 12px;
  font-family: 'Cascadia Code', 'Fira Code', monospace;
  font-size: 13px;
  color: var(--text);
  min-height: 80px;
  max-height: 200px;
  overflow: auto;
  white-space: pre-wrap;
}
.stderr { color: var(--stderr); }
.stdout { color: var(--stdout); }
.error { color: var(--stderr); }
.placeholder { color: var(--placeholder); }
.no-output { color: var(--placeholder); font-style: italic; }
</style>
