<template>
  <div class="app">
    <!-- HEADER -->
     <Header/>
    

    <!-- Welcome section -->
    <div class="user-home-container">
      <section class="welcome-section">
        <div class="welcome-text">
          <h2 class="welcome-title">Welcome, <span class="username">Username</span></h2>
          <p class="tagline">Discover delicious meals with what you already have.</p>
          <button class="start-cooking-btn">Start Cooking</button>
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

        <RouterLink to="/settings" class="card-item">
          <img src="/settings-icon.png" alt="Settings Icon" class="card-icon" />
          <h3 class="card-title">Settings</h3>
          <p class="card-subtitle">Tweak to your preferences</p>
        </RouterLink>
      </section>

      <!-- Graveyard Section -->
      <section class="graveyard-section">
        <div class="graveyard-card">
          <h3 class="graveyard-title">My Food Graveyard</h3>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Qty</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full Cream Milk</td>
                <td>2</td>
                <td class="expired-date">20/08/2025</td>
              </tr>
              <tr>
                <td>Mozarella Cheese</td>
                <td>300g</td>
                <td>28/09/2025</td>
              </tr>
            </tbody>
          </table>
          <RouterLink to="/fridge" class="view-more">View more >></RouterLink>
        </div>
      </section>
    </div>
    <!-- FOOTER -->
    <Footer/>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'
</script>


<style scoped>
/* GENERAL STYLES */
.app {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  color: black;
  /* all text black */
  background-color: white;
  margin: 0;
}

/* --- FOOD GRAVEYARD --- */
.graveyard-section {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.graveyard-card {
  width: 60%; /* Center and set width */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.graveyard-title {
  font-size: 22px;
  font-weight: 600;
  color: #44704d;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

thead th {
  background-color: #f0e0c0; /* Light orange-brown header color */
  color: #44704d;
  font-weight: 600;
  padding: 10px;
  border-bottom: 2px solid #a35d35;
}

tbody td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.expired-date {
  color: #d9534f; /* Red color for expired date */
  font-weight: 600;
}

.view-more {
  font-size: 14px;
  color: #a35d35;
  cursor: pointer;
  margin-top: 10px;
}

/* --- FEATURE CARDS --- */
.feature-cards {
  display: flex;
  justify-content: space-around;
  gap: 30px;
  margin: 30px 0;
}

.card-item {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 20px 15px;
  text-align: center;
  width: 30%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 60px; /* Adjust as needed for your icons */
  height: 60px;
  margin-bottom: 10px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #a35d35; /* Orange-brown */
  margin-bottom: 5px;
}

.card-subtitle {
  font-size: 14px;
  color: #777;
  margin: 0;
}

</style>
