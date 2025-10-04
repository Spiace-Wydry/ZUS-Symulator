<script setup lang="ts">
</script>

<template>
  <nav>
    <div class="nav-inner">
      <RouterLink to="/">Start</RouterLink>
      <RouterLink to="/simulate">Formularz</RouterLink>
      <RouterLink to="/results">Wyniki</RouterLink>
      <RouterLink to="/advanced">Dashboard</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped>
</style>
