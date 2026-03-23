<template>
  <div ref="editorRef" class="editor-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { rust } from '@codemirror/lang-rust'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'run'])

const editorRef = ref(null)
let view = null

onMounted(() => {
  const runKeymap = keymap.of([{
    key: 'Ctrl-Enter',
    run: () => { emit('run'); return true }
  }])

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      emit('update:modelValue', update.state.doc.toString())
    }
  })

  view = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [basicSetup, rust(), oneDark, runKeymap, updateListener]
    }),
    parent: editorRef.value
  })
})

watch(() => props.modelValue, (newVal) => {
  if (view && newVal !== view.state.doc.toString()) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newVal }
    })
  }
})

onUnmounted(() => {
  if (view) view.destroy()
})
</script>

<style scoped>
.editor-container {
  flex: 1;
  overflow: auto;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
}
.editor-container .cm-editor {
  height: 100%;
}
</style>
