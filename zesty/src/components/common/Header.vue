<template>
  <!-- HEADER -->
  <header id="start">
    <div class="logo-brand">
      <img src="/logo.png" alt="Zesty Logo" />
    </div>

    <!-- NORMAL NAV MENU (shown on large screens) -->
    <nav>
      <!-- For logged-out users -->
      <template v-if="!user">
        <RouterLink :to="{ path: '/', hash: '#start' }" :class="{ active: isActive('#start') }"
          >Home</RouterLink
        >
        <RouterLink
          :to="{ path: '/', hash: '#features' }"
          :class="{ active: isActive('#features') }"
          >Features</RouterLink
        >
        <RouterLink :to="{ path: '/', hash: '#contact' }" :class="{ active: isActive('#contact') }"
          >Contact Us</RouterLink
        >
        <RouterLink to="/login" :class="{ active: isActive('/login') }" class="login-btn"
          >Login</RouterLink
        >
      </template>

      <!-- For logged-in users -->
      <template v-else>
        <RouterLink to="/" :class="{ active: isActive('/home') }">Home</RouterLink>
        <RouterLink to="/myfridge" :class="{ active: isActive('/myfridge') }">My Fridge</RouterLink>
        <RouterLink to="/recipes" :class="{ active: isActive('/recipes') }">Recipes</RouterLink>
        <RouterLink to="/logout" :class="{ active: isActive('/logout') }" class="login-btn"
          >Logout</RouterLink
        >
      </template>
    </nav>

    <!-- HAMBURGER ICON (mobile only) -->
    <div class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- FULLSCREEN POPUP MENU (mobile only) -->
    <div v-if="menuOpen" class="menu-overlay">
      <div class="menu-content">
        <template v-if="!user">
          <RouterLink to="#start" :class="{ active: isActive('#start') }" @click="toggleMenu"
            >Home</RouterLink
          >
          <RouterLink to="#features" :class="{ active: isActive('#features') }" @click="toggleMenu"
            >Features</RouterLink
          >
          <RouterLink to="#contact" :class="{ active: isActive('#contact') }" @click="toggleMenu"
            >Contact Us</RouterLink
          >
          <RouterLink
            to="/login"
            :class="{ active: isActive('/login') }"
            class="login-btn"
            @click="toggleMenu"
            >Login</RouterLink
          >
        </template>

        <template v-else>
          <RouterLink to="/" :class="{ active: isActive('/') }" @click="toggleMenu"
            >Home</RouterLink
          >
          <RouterLink to="/myfridge" :class="{ active: isActive('/myfridge') }" @click="toggleMenu"
            >My Fridge</RouterLink
          >
          <RouterLink to="/recipes" :class="{ active: isActive('/recipes') }" @click="toggleMenu"
            >Recipes</RouterLink
          >
          <RouterLink
            to="/logout"
            :class="{ active: isActive('/logout') }"
            class="login-btn"
            @click="toggleMenu"
            >Logout</RouterLink
          >
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)
const user = ref(localStorage.getItem('username'))

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const isActive = (path) => {
  if (path.startsWith('#')) {
    return route.hash === path || (!route.hash && path === '#start') ? 'active' : ''
  }
  return route.path === path ? 'active' : ''
}

// Live update on login/logout
window.addEventListener('storage', () => {
  user.value = localStorage.getItem('username')
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque&family=Plus+Jakarta+Sans:wght@400;600&display=swap');

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  background-color: #e0c6a6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 20;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-brand img {
  height: 70px;
  width: auto;
}

/* --- Normal NAV MENU --- */
nav {
  display: flex;
  align-items: center;
}

nav a {
  font-size: 13px;
  margin-left: 24px;
  text-decoration: none;
  font-weight: 600;
  color: #44704d;
  transition: all 0.3s ease;
}

nav a:hover,
nav a.active {
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
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: white;
  color: #44704d;
}

/* --- HAMBURGER ICON --- */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
  z-index: 50;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #44704d;
  border-radius: 2px;
}

/* --- FULLSCREEN MENU --- */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 40;
  animation: fadeIn 0.3s ease forwards;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
}

.menu-content a {
  color: white;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.menu-content a:hover {
  color: #e0c6a6;
  transform: scale(1.05);
}

.menu-content .login-btn {
  background-color: #44704d;
  color: white;
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-size: 18px;
}

.menu-content .login-btn:hover {
  background-color: #e0c6a6;
  color: #44704d;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* --- Responsive Behaviour --- */
@media (max-width: 768px) {
  nav {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}
</style>
