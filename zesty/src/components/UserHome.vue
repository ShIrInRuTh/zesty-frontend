<template>
  <div class="app">
    <!-- HEADER -->
     <Header/>
    

    <!-- Welcome section -->
      <section class="welcome-section">
        <div class="welcome-text">
          <h2 class="welcome-title">Welcome, 
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
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'
</script>

<script>
export default {
  data() {
    return {
      currentUsername: "Mr Shar",
    }
  }
}
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

/* --- WELCOME SECTION STYLING (Kept the strong existing styling) --- */
.welcome-section {
    /* Use a warm, soft gradient background instead of flat color for better depth */
    background: linear-gradient(135deg, var(--color-background) 0%, #FFFDE7 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 60px 80px; /* Increased padding for spacious feel */
    margin-top: 30px;
    border-radius: 24px; /* More rounded corners */
    /* Refined, softer shadow with a subtle lift effect */
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

/* Subtle lift effect on hover for the entire section */
.welcome-section:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08);
}

/* Text Container */
.welcome-text {
    flex: 1;
    max-width: 55%; /* Increased text area */
    padding-right: 50px;
    z-index: 10;
}

/* The Title */
.welcome-title {
    font-family: var(--font-heading);
    font-size: 3.8rem; /* Larger for high impact */
    font-weight: 900;
    color: var(--color-text); /* Use dark text color for excellent contrast */
    line-height: 1.05;
    margin-bottom: 15px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

/* Username Highlight */
.welcome-title .username {
    color: var(--color-accent); /* Bright accent color for a pop */
    font-style: normal;
    font-weight: 900;
    padding: 0 5px;
    display: inline-block;
    position: relative;
    /* Optional: A simple line highlight under the name */
    text-decoration: underline;
    text-decoration-thickness: 4px;
    text-decoration-color: rgba(255, 112, 67, 0.3); /* Semi-transparent accent color */
    text-underline-offset: 8px;
}

/* Tagline/Subtitle */
.tagline {
    font-family: var(--font-body);
    font-size: 1.4rem; 
    color: var(--color-text);
    font-weight: 500;
    margin-bottom: 40px;
    opacity: 0.8;
}

/* Start Cooking Button */
.start-cooking-btn {
    padding: 1.1rem 3rem; /* Substantial touch target */
    font-size: 1.2rem;
    font-weight: 700;
    color: black; /* Ensures high contrast against the secondary color */
    background-color: var(--color-secondary);
    border: none;
    border-radius: 50px; /* Pill shape */
    cursor: pointer;
    text-decoration: none; /* RouterLink styling */
    display: inline-block; /* Required for padding and alignment */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    /* Stronger, more colorful shadow */
    box-shadow: 0 8px 25px rgba(212, 98, 79, 0.5);
    text-transform: uppercase;
    letter-spacing: 1px;
}

.start-cooking-btn:hover {
    background-color: #EF7A67; /* Noticeably lighter on hover */
    transform: translateY(-4px); /* Bigger lift effect */
    box-shadow: 0 12px 30px rgba(212, 98, 79, 0.7);
}

/* Image Styling */
.header-image-wrapper {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-left: 20px;
}

.header-pattern-img {
    width: 100%;
    max-width: 450px;
    height: auto;
    border-radius: 20px;
    object-fit: cover;
    /* Neutralized initial rotation, using shadow for dynamism */
    transform: rotate(0deg); 
    box-shadow: -15px 15px 40px rgba(0, 0, 0, 0.15); /* Shadow pulled left/down */
    transition: transform 0.5s ease-out;
}

.welcome-section:hover .header-pattern-img {
    transform: rotate(-1deg) scale(1.02); /* Slight rotation and scale on section hover */
}

/* --- RESPONSIVENESS (Mobile Optimization) --- */
@media (max-width: 1024px) {
    .welcome-section {
        flex-direction: column; /* Stack elements vertically */
        text-align: center;
        padding: 40px 30px;
    }

    .welcome-text {
        max-width: 100%;
        padding-right: 0;
        margin-bottom: 30px;
    }

    .welcome-title {
        font-size: 3rem; /* Adjust title size for mobile */
    }
    
    .tagline {
        font-size: 1.2rem;
    }

    .header-image-wrapper {
        justify-content: center;
        padding-left: 0;
    }

    .header-pattern-img {
        max-width: 300px; /* Smaller image on mobile */
        transform: none; /* No rotation on mobile */
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .welcome-section:hover .header-pattern-img {
        transform: none; /* Disable hover animation on mobile */
    }
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
