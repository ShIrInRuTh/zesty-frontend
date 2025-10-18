<template>
  <!-- HEADER -->
  <header>
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
        <RouterLink :to="{ path: '/', hash: '#feature' }" :class="{ active: isActive('#feature') }"
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
        <RouterLink to="/userhome" :class="{ active: isActive('/userhome') }">Home</RouterLink>
        <RouterLink to="/fridge" :class="{ active: isActive('/fridge') }">My Fridge</RouterLink>
        <RouterLink to="/recipe" :class="{ active: isActive('/recipe') }">Recipes</RouterLink>

        <!-- Profile and Notification Icons -->
        <RouterLink to="/logout" :class="{ active: isActive('/logout') }" class="login-btn">
          Logout
        </RouterLink>
        <div class="nav-icons">
          <RouterLink to="/profile" class="profile-circle">
            <img src="../../../public/profile.jpeg" alt="Profile" />
            <!-- Or use initials as fallback -->
            <!-- <span>JD</span> -->
          </RouterLink>
          <button class="icon-btn notification-btn">
            <i class="fas fa-bell"></i>
            <!-- Font Awesome icon -->
            <!-- Optional notification badge -->
            <span class="notification-badge">3</span>
          </button>
        </div>
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
          <RouterLink to="/" :class="{ active: isActive('/') }" @click="toggleMenu"
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
          <RouterLink to="/userhome" :class="{ active: isActive('/userhome') }" @click="toggleMenu"
            >Home</RouterLink
          >
          <RouterLink to="/fridge" :class="{ active: isActive('/fridge') }" @click="toggleMenu"
            >My Fridge</RouterLink
          >
          <RouterLink to="/recipe" :class="{ active: isActive('/recipe') }" @click="toggleMenu"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const user = ref(sessionStorage.getItem('username'))

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// -- Improved isActive function --
const isActive = (target) => {
  if (target.startsWith('#')) {
    // For sections with hash navigation (e.g. #feature)
    // Default to #start if no hash present
    const currentHash = route.hash || '#start'
    return currentHash === target
  }
  if (target === '/') {
    // Active when on exact home path and no hash (or hash is #start)
    return route.path === '/' && (!route.hash || route.hash === '' || route.hash === '#start')
  }
  // For all other paths: exact match
  return route.path === target
}

onMounted(() => {
  if (window.location.hash) {
    const hash = window.location.hash
    const element = document.querySelector(hash)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setTimeout(() => {
      // This will update both the address bar and the Vue Router's current route
      router.replace({ path: window.location.pathname })
    }, 400)
  }
})

// Listen for login/logout updates via storage events
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

/* --- Profile Popup Styles --- */
.profile-container {
  position: relative;
}

.profile-circle,
.profile-circle:hover,
.profile-circle:focus {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  background: #f0f0f0;
}

.profile-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  padding: 0;
  margin: 0;
}

.profile-popup {
  position: absolute;
  top: 50px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
  animation: popupFadeIn 0.2s ease-out;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #44704d, #5a8c65);
  color: white;
  border-radius: 12px 12px 0 0;
}

.popup-profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  margin-right: 12px;
}

.popup-profile-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popup-user-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.popup-user-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.popup-menu {
  padding: 10px 0;
}

.popup-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
}

.popup-item:hover {
  background: #f8f9fa;
  color: #44704d;
}

.popup-item i {
  width: 20px;
  margin-right: 12px;
  font-size: 14px;
}

.popup-divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background: #fff5f5;
  color: #dc3545;
}

/* --- Navigation Icons --- */
.nav-icons {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 24px;
}

.notification-btn {
  background-color: #44704d;
  width: 40px;
  height: 40px;
  color: white;
  border-radius: 50%;
  transition:
    background-color 0.3s,
    color 0.3s;
  position: relative;
  padding: 0; /* Remove default padding */
  border: none;
  font-size: 1.2rem;
  display: flex; /* Enable Flexbox */
  align-items: center; /* Vertical center */
  justify-content: center; /* Horizontal center */
}

.notification-btn:hover {
  background-color: white;
  color: #44704d;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- Mobile Profile Section --- */
.mobile-profile-section {
  width: 100%;
  text-align: center;
  margin: 20px 0;
}

.mobile-profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.mobile-profile-header img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #44704d;
}

.mobile-profile-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.mobile-profile-header p {
  margin: 4px 0 0 0;
  color: #e0c6a6;
  font-size: 14px;
}

.mobile-profile-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 5px 0;
}

.mobile-profile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e0c6a6;
}

.mobile-profile-link i {
  width: 20px;
}

/* --- Rest of your existing styles (Hamburger, Menu Overlay, etc.) --- */
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

@media (max-width: 768px) {
  nav {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
