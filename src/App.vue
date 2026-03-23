<template>
  <div style="height: 400px;">
    <Editor v-model="code" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Editor from './components/Editor.vue'
const code = ref('fn main() {\n    println!("Hello, world!");\n}')
</script>
