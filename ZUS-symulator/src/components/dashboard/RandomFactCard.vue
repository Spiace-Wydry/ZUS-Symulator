<script setup lang="ts">
import { ref } from 'vue'
import { getRandomFact } from '@/services/mockData'

const fact = ref(getRandomFact())
function refresh() {
  fact.value = getRandomFact()
}
</script>

<template>
  <div class="card" role="note" aria-live="polite">
    <h3>Losowa ciekawostka</h3>
    <p>{{ fact }}</p>
    <button class="button" @click="refresh" aria-label="Wylosuj kolejną ciekawostkę">Losuj</button>
  </div>
</template>

<style scoped>
button { margin-top: 8px; }
</style>
