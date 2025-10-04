<script setup lang="ts">
</script>

<template>
  <main class="container">
    <h1>Symulator Emerytalny ZUS</h1>
    <p>Witamy! Zacznij od podania oczekiwanej emerytury lub przejdź do formularza.</p>
    <RouterLink class="btn" to="/simulate">Rozpocznij symulację</RouterLink>
  </main>
</template>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
h1 { color: var(--zus-navy, #00416e); }
.btn { display: inline-block; padding: 10px 16px; background: var(--zus-blue, #3f84d2); color: #fff; border-radius: 8px; text-decoration: none; }
.btn:focus { outline: 2px solid var(--zus-blue, #3f84d2); }
</style>
