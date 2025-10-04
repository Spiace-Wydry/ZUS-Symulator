<script setup lang="ts">
</script>

<template>
  <main class="container">
    <h1>Symulator Emerytalny ZUS</h1>
    <p>Witamy! Zacznij od podania oczekiwanej emerytury lub przejdź do formularza.</p>
    <RouterLink class="button" to="/simulate">Rozpocznij symulację</RouterLink>
  </main>
</template>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
h1 { color: var(--zus-navy, #00416e); }
</style>
