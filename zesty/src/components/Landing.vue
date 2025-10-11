<template>
  <div class="app">
    <!-- HEADER -->
    <header>
      <div class="logo-brand">
        <img src="/logo.png" alt="Zesty Logo" />
        <h1>ZESTY</h1>
      </div>

      <nav>
        <RouterLink to="/" class="active" exact>Home</RouterLink>
        <RouterLink to="#features">Features</RouterLink>
        <RouterLink to="#contact">Contact Us</RouterLink>
        <RouterLink to="/login" class="login-btn">Login</RouterLink>
      </nav>
    </header>

    <!-- Dramatic Intro Screen -->
    <transition name="fade">
      <div v-if="showIntro" class="intro">
        <h1 class="logo">ZESTY</h1>
      </div>
    </transition>

    <!-- Actual Landing Page -->
    <transition name="fade-delayed">
      <div v-if="!showIntro" class="landing">

        <!-- HERO SECTION -->
        <main>
          <!-- HERO OVERLAY -->
          <div class="hero-overlay">
            <h2>{{ randomTagline }}</h2>
            <p>
              Zesty is your ultimate cooking companion.
            </p>
            <RouterLink to="/recipes" class="explore-btn">Explore Recipes</RouterLink>
          </div>

          <!-- CAROUSEL SECTION -->
          <section class="carousel-section">
            <div class="mx-auto box">
              <!-- put the carousel in a box and center it -->

              <!-- set the carousel -->
              <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                <!-- small clickable dashes at the bottom of the carousel -->
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
                </div>

                <!-- Three carousel slides with the first carousel being active -->
                <!-- carousel-inner is container for all slides -->
                <div class="carousel-inner">
                  <!-- carousel-item is each slide -->
                  <div class="carousel-item active">
                    <img src="../../public/delicious-healthy-asian-food-gray-textured-background-with-copy-space.jpg"
                      class="d-block w-100" alt="..." />
                  </div>

                  <div class="carousel-item">
                    <img src="../../public/noodles-spicy-frying-pans-with-ingredients-black-cement-surface-top-view.jpg"
                      class="d-block w-100" alt="..." />
                  </div>

                  <div class="carousel-item">
                    <img src="../../public/top-view-fresh-delicious-vietnamese-food-table.jpg" class="d-block w-100"
                      alt="..." />
                  </div>

                  <!-- buttons to navigate the slides manually -->
                  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                  </button>

                  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- EVENT CARDS -->
          <div class="container">

            <div class="row">

              <div class="col">
                <div class="card" style="width: 18rem;">
                  <img src="../../public/logo.png" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">Card title</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                      content.</p>
                    <a href="http://sunjun.site" class="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>

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
    </transition>

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<script>
export default {
  data() {
    return {
      showIntro: true,
      randomTagline: "",
      taglines: [        // list of random taglines
        "Cooking with Attitude 💅",
        "Spice Up Your Kitchen Adventures 🌶️",
        "Where Bold Flavours Begin",
        "Flavour, Fun, and a Pinch of Sass 🤌",
        "Your Ultimate Cooking Companion",
        "Whisk, Stir, Taste, Repeat",
        "Unleash Your Inner Chef 🧑‍🍳",
        "Cooking like a Chef, I'm a 5-star Michelin ✨",
        "I'm COOKED 💀",
        "What's cooking, good-looking? 😏"
      ]
    };
  },

  mounted() {
    // pick a random tagline
    this.randomTagline = this.taglines[Math.floor(Math.random() * this.taglines.length)];

    // Keep intro for ~2.5 seconds, then fade it out
    setTimeout(() => {
      this.showIntro = false;
    }, 2500);
  }
};
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

.login-btn {
  border: 1px solid black;
  padding: 6px 16px;
  border-radius: 9999px;
}

.login-btn:hover {
  background-color: black;
  color: white;
}

/* --- Fullscreen intro overlay --- */
.intro {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #ff7b00 10%, #111 90%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: pulse 1.2s ease-in-out infinite alternate;
}

.logo {
  font-size: 5rem;
  letter-spacing: 0.1em;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
  animation: zoomOut 2s ease-in-out forwards;
}

/* --- Landing page --- */
.landing {
  opacity: 0;
  animation: fadeIn 1s 2.5s ease-in-out forwards;
  /* fade in after intro */
  min-height: 100vh;
  background: #fff;
  color: #333;
  text-align: center;
  padding-top: 20vh;
}

/* --- Animations --- */
@keyframes pulse {
  from {
    background: radial-gradient(circle at center, #ff7b00 20%, #000 100%);
  }

  to {
    background: radial-gradient(circle at center, #ff9500 10%, #111 90%);
  }
}

@keyframes zoomOut {
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* --- Transition helpers --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-delayed-enter-active {
  transition: opacity 1.5s ease-in-out 0.4s;
}

.fade-delayed-enter-from {
  opacity: 0;
}

.fade-delayed-enter-to {
  opacity: 1;
}

/* HERO SECTION */
main {
  flex-grow: 1;
  position: relative;
}

.hero {
  text-align: center;
  padding: 80px 16px;
  color: #000;
}

.hero h2 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.hero p {
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 24px;
}

.hero-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.35);
  /* optional readability */
  padding: 2rem 3rem;
  border-radius: 1rem;
  z-index: 5;
  max-width: 80%;
}

.carousel-section {
  position: relative;
  max-width: 900px;
  margin: 0 auto 60px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.explore-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: black;
  color: white;
  border-radius: 9999px;
  font-weight: bold;
  text-decoration: none;
}

.explore-btn:hover {
  background-color: gray;
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
