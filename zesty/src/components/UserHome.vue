<template>
  <div class="app">
    <!-- HEADER -->
    <Header />

    <main class="user-home-main">
      <!-- Welcome section -->
      <section class="welcome-section">
        <div class="welcome-text">
          <h2 class="welcome-title">
            Welcome,
            <span class="username">{{ currentUsername }}</span>
          </h2>
          <p class="tagline">Discover delicious meals with what you already have.</p>
          <RouterLink to="/recipe" class="start-cooking-btn">Start Cooking</RouterLink>
        </div>
        <div class="header-image-wrapper">
          <img
            src="/header-pattern.jpg"
            alt="Food pattern illustration"
            class="header-pattern-img"
          />
        </div>
      </section>

      <!-- 3 Feature Cards -->
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

      <!-- Dashboard Section (Fridge & Graveyard) -->
      <section class="dashboard-section">
        <!-- Fridge Summary -->
        <div class="dashboard-card fridge-summary">
          <h3 class="dashboard-title">Expiring Soon</h3>
          <ul class="item-list">
            <li v-for="item in fridgeItems" :key="item.id" class="item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-expiry">Exp: {{ getFormattedDate(item.expiryDate) }}</span>
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
          <RouterLink to="/graveyard" class="view-more">View full graveyard</RouterLink>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue' // <-- Fixed typo 'commonf' to 'common'

// Dummy data - replace with your actual data store (e.g., Pinia)
const allFridgeItems = [
  { id: 1, name: 'Milk', expiryDate: '2025-11-02' },
  { id: 2, name: 'Eggs', expiryDate: '2025-11-05' },
  { id: 3, name: 'Cheese', expiryDate: '2025-11-10' },
  { id: 4, name: 'Chicken Breast', expiryDate: '2025-11-01' },
  { id: 5, name: 'Carrots', expiryDate: '2025-11-08' },
  { id: 6, name: 'Yogurt', expiryDate: '2025-11-04' },
  { id: 7, name: 'Old Bread', expiryDate: '2025-10-28' }, // Expired
  { id: 8, name: 'Spinach', expiryDate: '2025-10-25' }, // Expired
]

const username = 'Foodie' // Dummy username

const currentUsername = computed(() => {
  // Replace with logic to get logged-in user's name
  return username || 'User'
})

// Sort items by expiry date (soonest first)
const sortedItems = computed(() => {
  return [...allFridgeItems].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
})

// Get top 5 items expiring soon (but not yet expired)
const fridgeItems = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return sortedItems.value.filter((item) => item.expiryDate >= today).slice(0, 5)
})

// Get top 5 recently expired items
const expiredItems = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return sortedItems.value
    .filter((item) => item.expiryDate < today)
    .reverse() // Show most recently expired first
    .slice(0, 5)
})

const getFormattedDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
/* Using fonts and colors from your other pages for consistency */
:root {
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
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw; /* <-- Added for consistency with your other pages */
  background-color: var(--color-bg);
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

/* --- Welcome Section --- */
.welcome-section {
  display: flex;
  flex-direction: column; /* Mobile-first: stack text and image */
  align-items: center;
  background: white;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 24px;
  margin-bottom: 32px;
  overflow: hidden;
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
}

.start-cooking-btn {
  display: inline-block;
  background: var(--color-primary-green);
  color: white;
  padding: 12px 28px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.start-cooking-btn:hover {
  background: var(--color-dark-green);
  transform: translateY(-2px);
}

.header-image-wrapper {
  flex: 1;
  max-width: 400px; /* Control image size */
  margin-top: 24px; /* Add space on mobile */
}

.header-pattern-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* --- Feature Cards --- */
.feature-cards {
  display: grid;
  /* This is the responsive magic:
    - 'auto-fit': Fit as many columns as possible.
    - 'minmax(280px, 1fr)': Each column must be at least 280px wide.
      If there's extra space, distribute it equally (1fr).
    This handles all 6 breakpoints without media queries.
  */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
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
    box-shadow 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
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
  /* Capped max width of columns to 550px to prevent over-stretching */
  grid-template-columns: repeat(auto-fit, minmax(300px, 550px));
  gap: 24px;
  /* Center the grid items on large screens */
  justify-content: center;
}

.dashboard-card {
  background: #ffffff;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 24px;
  border: 1px solid #f0f0f0; /* Added subtle border for definition */
}

/* Added gradient background for fridge summary */
.dashboard-card.fridge-summary {
  background: linear-gradient(to bottom, #f2f7f2, #ffffff 60%);
}

/* Added gradient background for graveyard summary */
.dashboard-card.graveyard {
  background: linear-gradient(to bottom, #fbf7f4, #ffffff 60%);
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary-green);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-light-tan);
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
  padding: 10px 0;
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
}

/* Graveyard Table */
.table-responsive-wrapper {
  width: 100%;
  /* This makes the table scroll horizontally on small screens */
  /* if it's still too wide, without breaking the card layout. */
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
}

/* Medium (md) - 768px */
@media (min-width: 768px) {
  .user-home-main {
    padding: 32px;
  }

  .welcome-section {
    flex-direction: row; /* Image beside text */
    padding: 32px;
    align-items: center;
  }

  .welcome-text {
    padding-right: 24px;
  }

  .header-image-wrapper {
    margin-top: 0; /* Remove top margin */
  }

  .welcome-title {
    font-size: 2.5rem;
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
