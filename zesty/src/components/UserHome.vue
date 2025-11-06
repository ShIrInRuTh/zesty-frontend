<template>
  <div class="app">
    <!-- HEADER -->
    <Header />

    <main class="user-home-main">
      <!-- Welcome section -->
      <!-- This outer section is now the styled container -->
      <section class="welcome-section">
        <!-- This new inner div handles the flex layout -->
        <div class="welcome-content">
          <div class="welcome-text">
            <h2 class="welcome-title">
              Welcome,
              <span class="username">{{ currentUsername }}</span>
            </h2>
            <p class="tagline">Discover delicious meals with what you already have.</p>
            <RouterLink to="/recipe" class="start-cooking-btn">
              <span>Start Cooking</span>
              <!-- Added aesthetic icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="btn-icon"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </RouterLink>
          </div>
          <!-- Reverted back to static image -->
          <div class="header-image-wrapper">
            <img
              src="/header-pattern.jpg"
              alt="Food pattern illustration"
              class="header-pattern-img"
            />
          </div>
        </div>
      </section>

      <!-- Added a section header for better hierarchy -->
      <div class="section-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
        <h3>Get Started</h3>
      </div>

      <!-- 3 Feature Cards -->
      <!-- Removed the outer container card for a cleaner look -->
      <section class="feature-cards">
        <RouterLink to="/fridge" class="card-item">
          <img src="/fridge-icon.png" alt="Fridge Icon" class="card-icon" />
          <h3 class="card-title">My Fridge</h3>
          <p class="card-subtitle">Your Fridge, your rules</p>
        </RouterLink>

        <RouterLink to="/recipe" class="card-item">
          <img src="/recipes-icon.png" alt="Recipe Book Icon" class="card-icon" />
          <h3 class="card-title">My Recipes</h3>
          <p class="card-subtitle">View your Cookbook</p>
        </RouterLink>

        <RouterLink to="/profile" class="card-item">
          <img src="/profile-icon.png" alt="Profile Icon" class="card-icon" />
          <h3 class="card-title">Your Profile</h3>
          <p class="card-subtitle">Manage your account</p>
        </RouterLink>
      </section>

      <!-- Added a section header for better hierarchy -->
      <div class="section-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
        <h3>Your Kitchen Dashboard</h3>
      </div>

      <!-- Dashboard Section (Fridge & Graveyard) -->
      <section class="dashboard-section">
        <!-- Fridge Summary -->
        <div class="dashboard-card fridge-summary">
          <h3 class="dashboard-title">Expiring Soon</h3>
          <ul class="item-list">
            <li v-for="item in fridgeItems" :key="item.id" class="item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-expiry">
                <!-- Added a small icon for visual punch -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                Exp: {{ getFormattedDate(item.expiryDate) }}
              </span>
            </li>
          </ul>
          <RouterLink to="/fridge" class="view-more">View full fridge</RouterLink>
        </div>

        <!-- Graveyard -->
        <div class="dashboard-card graveyard">
          <h3 class="dashboard-title">Recently Expired</h3>
          <div class="table-responsive-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Expired On</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in expiredItems" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td class="expired-date">{{ getFormattedDate(item.expiryDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- The 'View full graveyard' link was missing from your template, so I've left it out -->
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue' // <-- Fixed typo 'commonf' to 'common'
import axios from 'axios'
import api from '../API/supabaseAPI'

// --- Welcome username ---
const usernameRef = ref('User')
const currentUsername = computed(() => usernameRef.value || 'User')

// --- Raw items fetched from backend ---
const allFridgeItems = ref([])

// Fetch username from Supabase REST and items from backend
async function loadUserAndItems() {
  const userId = sessionStorage.getItem('user_id')
  const fridgeId = sessionStorage.getItem('fridgeId')
  if (!userId || !fridgeId) {
    console.warn('Missing session: user_id or fridgeId')
    return
  }

  try {
    // Username via Supabase REST
    const { data: userRows } = await api.get('/users', {
      params: { select: 'username', user_id: `eq.${userId}` },
    })
    usernameRef.value = userRows?.[0]?.username || 'User'
  } catch (e) {
    console.error('Failed to load username', e)
  }

  try {
    // Fridge items via backend route already used in Fridge.vue
    const res = await axios.post(`http://localhost:8000/api/fridge/${fridgeId}`, { cat: '' })
    const result = res.data?.message || []
    allFridgeItems.value = result.map((item) => ({
      id: item.item_id,
      name: item.item_name,
      expiryDate: item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : '',
    }))
  } catch (e) {
    console.error('Failed to load fridge items', e)
  }
}

onMounted(loadUserAndItems)

// Sort items by expiry date (soonest first)
const sortedItems = computed(() => {
  return [...allFridgeItems.value].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
})

// Top 5 expiring within next 14 days (and not expired)
const fridgeItems = computed(() => {
  const today = new Date()
  const in14 = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  return sortedItems.value
    .filter((item) => {
      const d = new Date(item.expiryDate)
      return !isNaN(d) && d >= today && d <= in14
    })
    .slice(0, 5)
})

// Top 5 recently expired
const expiredItems = computed(() => {
  const today = new Date()
  return [...sortedItems.value]
    .filter((item) => {
      const d = new Date(item.expiryDate)
      return !isNaN(d) && d < today
    })
    .reverse()
    .slice(0, 5)
})

const getFormattedDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleString(undefined, options)
}
</script>

<style scoped>
/* --- CSS Animations --- */
@keyframes pulse {
  0% {
    box-shadow: var(--shadow-main);
  }
  50% {
    /* Brighter, slightly larger shadow in the primary color */
    box-shadow: 0 8px 25px rgba(68, 112, 77, 0.4);
  }
  100% {
    box-shadow: var(--shadow-main);
  }
}

/* Using fonts and colors from your other pages for consistency */
/* FIX: Combined both .app blocks into one for cleanliness */
.app {
  --color-primary-green: #44704d;
  --color-dark-green: #3a5f42;
  --color-primary-brown: #a35d35;
  --color-light-tan: #f0e0c0;
  --color-bg: #fdfaf6;
  --color-text-primary: #333;
  --color-text-secondary: #555;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --border-radius-main: 18px;
  --shadow-main: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw; /* <-- Added for consistency with your other pages */
  background-color: white;
  font-family: var(--font-body);
  color: var(--color-text-primary);
}

.user-home-main {
  flex-grow: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* --- Section Header --- */
/* New element for better page structure */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 48px; /* Added spacing between sections */
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(68, 112, 77, 0.1); /* Softer underline */
}

.section-header:first-of-type {
  margin-top: 0; /* No top margin for the first one */
}

.section-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-primary-green);
}

.section-header svg {
  width: 24px;
  height: 24px;
  stroke: var(--color-primary-brown);
}

/* --- Welcome Section --- */
.welcome-section {
  background: linear-gradient(135deg, #fdfaf6, #fbf7f4 70%); /* More subtle tan gradient */
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 24px;
  margin-bottom: 32px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.welcome-content {
  display: flex;
  flex-direction: column; /* Mobile-first */
  align-items: center;
  gap: 24px; /* Added gap */
}

.welcome-text {
  flex: 1;
  text-align: center; /* Center text on mobile */
}

.welcome-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.username {
  color: var(--color-primary-green);
}

.tagline {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  max-width: 450px; /* Constrain line length */
  margin-left: auto;
  margin-right: auto;
}

.start-cooking-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary-green);
  color: white;
  padding: 14px 32px; /* Made button slightly larger */
  border-radius: 30px; /* Fully rounded */
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem; /* Slightly larger text */
  box-shadow: var(--shadow-main);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
  /* Added "fun" pulse animation */
  animation: pulse 2.5s infinite ease-in-out;
}

.start-cooking-btn:hover {
  background: var(--color-dark-green);
  transform: translateY(-3px); /* Deeper hover */
  box-shadow: var(--shadow-hover);
  animation-play-state: paused; /* Pause animation on hover */
}

.start-cooking-btn .btn-icon {
  width: 20px; /* Slightly larger icon */
  height: 20px;
  transition: transform 0.2s ease;
}

.start-cooking-btn:hover .btn-icon {
  transform: translateX(4px); /* Bigger nudge */
}

.header-image-wrapper {
  flex: 1;
  max-width: 400px; /* Control image size */
  width: 100%;
}

/* Style for the static image */
.header-pattern-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* --- Feature Cards --- */
/* Removed container styles from this section for a cleaner layout */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  /* Removed background, box-shadow, padding, border */
}

.card-item {
  background: #ffffff;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 24px;
  text-align: center;
  text-decoration: none;
  color: var(--color-text-primary);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease; /* Added border-color to transition */
  border: 2px solid transparent; /* Start with transparent border */
}

.card-item:hover {
  transform: translateY(-6px); /* Deeper hover effect */
  box-shadow: var(--shadow-hover);
  border-color: var(--color-primary-green); /* Add green border on hover */
}

.card-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-primary-green);
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

/* --- Dashboard Section --- */
.dashboard-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Changed to 1fr */
  gap: 24px;
  /* This prevents cards from stretching vertically */
  align-items: start;
}

.dashboard-card {
  background: #ffffff;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 24px;
  border: 1px solid #f0f0f0;
  /* Ensures cards in the same row have the same height if needed, but align-items:start prevents stretching */
  height: 100%;
}

.dashboard-card.fridge-summary {
  background: linear-gradient(to bottom, #f2f7f2, #ffffff 60%);
}

.dashboard-card.graveyard {
  background: linear-gradient(to bottom, #fbf7f4, #ffffff 60%);
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary-green);
  margin-bottom: 20px;
  padding-bottom: 10px;
  /* Updated border to be more subtle */
  border-bottom: 3px solid rgba(68, 112, 77, 0.2);
}

.view-more {
  display: inline-block;
  font-size: 0.9rem;
  color: var(--color-primary-brown);
  cursor: pointer;
  margin-top: 16px;
  text-decoration: none;
  font-weight: 600;
}
.view-more:hover {
  text-decoration: underline;
}

/* Fridge Summary List */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px; /* Added a little horizontal padding */
  border-bottom: 1px solid #f0f0f0;
}
.item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
}

.item-expiry {
  font-size: 0.9rem;
  color: #c0392b; /* Red from Fridge.vue */
  font-weight: 500;
  /* Aligns icon with text */
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Graveyard Table */
.table-responsive-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: var(--color-light-tan);
  color: var(--color-primary-green);
  font-weight: 600;
  padding: 12px;
  border-bottom: 2px solid var(--color-primary-brown);
  text-align: left;
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: var(--color-text-secondary);
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.expired-date {
  color: #d9534f; /* Red color for expired date */
  font-weight: 600;
}

/* --- Breakpoints for larger screens --- */
/* Small (sm) - 576px */
@media (min-width: 576px) {
  .welcome-text {
    text-align: left; /* Align text left */
  }
  .tagline {
    margin-left: 0;
    margin-right: 0;
  }
}

/* Medium (md) - 768px */
@media (min-width: 768px) {
  .user-home-main {
    padding: 32px;
  }

  .welcome-section {
    padding: 32px;
  }

  .welcome-content {
    flex-direction: row; /* Image beside text */
    align-items: center;
  }

  .welcome-text {
    padding-right: 24px;
  }

  .welcome-title {
    font-size: 2.5rem;
  }

  /* Make dashboard a 2-column layout explicitly */
  .dashboard-section {
    grid-template-columns: 1fr 1fr;
  }
}

/* Large (lg) - 992px */
@media (min-width: 992px) {
  .welcome-section {
    padding: 48px;
  }

  .welcome-title {
    font-size: 2.75rem;
  }
}
</style>
