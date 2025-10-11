<template>
  <!-- HEADER -->
  <header>
    <div class="logo-brand">
      <img src="/logo.png" alt="Zesty Logo" />
    </div>

    <nav>
      <RouterLink to="/" class="active" exact>Home</RouterLink>
      <RouterLink to="#features">Features</RouterLink>
      <RouterLink to="#contact">Contact Us</RouterLink>
      <RouterLink to="/login" class="login-btn">Login</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque&family=Plus+Jakarta+Sans:wght@400;600&display=swap');

/* HEADER */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background-color: #e0c6a6;
  z-index: 10;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

h1,
h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-brand img {
  height: 9%;
  width: 9%;
}

.logo-brand h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

nav a {
  font-size: 13px;
  margin-left: 24px;
  text-decoration: none;
  font-weight: 600;
  color: #44704d;
  transition: all 0.3s ease;
}

nav a:hover {
  background-color: #44704d;
  color: white;
  border-radius: 10px;
  padding: 0.9rem;
}

nav .active {
  background-color: #44704d;
  color: white;
  border-radius: 10px;
  padding: 0.9rem;
}

.login-btn {
  padding: 1rem;
  border-radius: 1rem;
  background-color: #44704d;
  color: white;
  box-shadow: 2px 2px #af9e8b;
  text-decoration: none;
}

.login-btn:hover {
  background-color: white;
  color: #44704d;
}
</style>
