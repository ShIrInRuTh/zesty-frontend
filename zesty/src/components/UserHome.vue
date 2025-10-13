<template>
  <div class="app">
    <!-- HEADER -->
    <header>
      <div class="logo-brand">
        <img src="/logo.png" alt="Zesty Logo" />
        <h1>ZESTY</h1>
      </div>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      />

      <nav>
        <RouterLink to="/userhome" class="active" exact>Home</RouterLink>
        <RouterLink to="/fridge">My Fridge</RouterLink>
        <RouterLink to="/recipes">Recipes</RouterLink>

        <div class="user-dropdown">
          <button class="user-icon-btn">👤</button>
          <div class="dropdown-content">
            <a href="#">My Account</a>
            <a href="#">Settings</a>
            <a href="#">Log out</a>
          </div>
        </div>
      </nav>
    </header>

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
        <div class="card-item">
          <img src="/fridge-icon.png" alt="Fridge Icon" class="card-icon" />
          <h3 class="card-title">My Fridge</h3>
          <p class="card-subtitle">Your Fridge, your rules</p>
        </div>

        <div class="card-item">
          <img src="/recipes-icon.png" alt="Recipe Book Icon" class="card-icon" />
          <h3 class="card-title">My Recipes</h3>
          <p class="card-subtitle">View your Cookbook</p>
        </div>

        <div class="card-item">
          <img src="/settings-icon.png" alt="Settings Icon" class="card-icon" />
          <h3 class="card-title">Settings</h3>
          <p class="card-subtitle">Tweak to your preferences</p>
        </div>
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
          <div class="view-more">View more >></div>
        </div>
      </section>
    </div>
    <!-- FOOTER -->
    <footer>
      <div class="footer-links">
        <RouterLink to="/privacy">Privacy</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
      <p>© 2025 Zesty • Crafted with ❤️ for food lovers</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
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

/* HEADER */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  background-color: #e0c6a6;
  z-index: 10;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-brand img {
  height: 48px;
  width: auto;
}

.logo-brand h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

nav a {
  margin-left: 24px;
  text-decoration: none;
  font-weight: 600;
  color: #44704d;
  transition: color 0.3s;
}

nav a:hover {
  color: gray;
}

nav a .active {
  color: gray;
}

.user-dropdown {
  position: relative;
  display: inline-block;
  margin-left: 24px;
  z-index: 20;
}

.user-icon-btn {
  background-color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-content {
  display: none; /* Hidden by default */
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  min-width: 130px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 21;
  padding: 5px 0;
  border: 1px solid #ddd;
}

.user-dropdown:hover .dropdown-content {
  display: block; /* Show on hover */
}

.dropdown-content a {
  color: black;
  padding: 8px 16px;
  text-decoration: none;
  display: block;
  font-size: 14px;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
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

/* FOOTER */
footer {
  background-color: white;
  text-align: center;
  padding: 24px 16px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.footer-links a {
  text-decoration: none;
  color: black;
  transition: text-decoration 0.3s;
}

.footer-links a:hover {
  text-decoration: underline;
}

footer p {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}
</style>
