<template>
  <div ref="editorRef" class="editor-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { rust } from '@codemirror/lang-rust'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
  modelValue: { type: String, default: '' },
  dark: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue', 'run'])

const editorRef = ref(null)
let view = null
const themeCompartment = new Compartment()

const lightTheme = EditorView.theme({
  '&': { backgroundColor: '#ffffff', color: '#24292e' },
  '.cm-gutters': { backgroundColor: '#f5f5f5', color: '#999', borderRight: '1px solid #d0d0d0' },
  '.cm-activeLineGutter': { backgroundColor: '#e8e8e8' },
  '.cm-activeLine': { backgroundColor: '#f0f0f0' },
  '.cm-selectionBackground': { backgroundColor: '#b3d4fc' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#b3d4fc' },
  '.cm-cursor': { borderLeftColor: '#24292e' }
})

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
      extensions: [
        basicSetup,
        rust(),
        themeCompartment.of(props.dark ? oneDark : lightTheme),
        runKeymap,
        updateListener
      ]
    }),
    parent: editorRef.value
  })
})

watch(() => props.dark, (isDark) => {
  if (view) {
    view.dispatch({
      effects: themeCompartment.reconfigure(isDark ? oneDark : lightTheme)
    })
  }
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
  border: 1px solid var(--border);
  border-radius: 4px;
}
.editor-container .cm-editor {
  height: 100%;
}
</style>
