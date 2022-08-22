<template>
  <div class="w-full h-full select-none">
    it works!
    {{count}}
    <button @click="count++">+</button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)

</script>
