<template>
  <div class="w-full h-full select-none">
    <div class="h-7 bg-gray-300 dragable"></div>
    <div class="flex h-full">
      <div class="w-1/5 h-full bg-blue-50">
        <div v-for="dir in dirs" @click="goDir(dir)">
          {{ dir.name }} {{ dir.type }}
        </div>
      </div>
      <div class="w-4/5 h-full bg-green-50" @click="ppt">
        {{ content }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getDir, readFile } from '../apis'
import { ref } from 'vue'

let currentDir = '/Users/cwj/test/slidev/slidev'

const dirs = ref(getDir(currentDir))
const content = ref('')

const ppt = () => {
  alert(1)
}

const goDir = (dir: any) => {
  if (dir.type === 2) {
    currentDir += `/${dir.name}`
    dirs.value = getDir(currentDir)
  } else {
    console.log(currentDir + `/${dir.name}`)
    content.value = readFile(currentDir + `/${dir.name}`)
  }
}
</script>
