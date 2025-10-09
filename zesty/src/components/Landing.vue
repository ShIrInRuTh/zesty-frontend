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
        <RouterLink to="/" class="active" exact>Home</RouterLink>
        <RouterLink to="#features">Features</RouterLink>
        <RouterLink to="#contact">Contact Us</RouterLink>
        <RouterLink to="/login" class="login-btn">Login</RouterLink>
      </nav>
    </header>

    <!-- HERO SECTION -->
    <main>
      <section class="hero">
        <h2>Cooking with Attitude</h2>
        <p>
          Discover bold flavours, creative recipes, and a pinch of sass. Zesty is your ultimate
          cooking companion.
        </p>
        <RouterLink to="/recipes" class="explore-btn">Explore Recipes</RouterLink>
      </section>

      <!-- CAROUSEL SECTION -->
      <section class="carousel-section">
        <div class="mx-auto box">
          <!-- put the carousel in a box and center it -->

          <!-- set the carousel -->
          <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
            <!-- small clickable dashes at the bottom of the carousel -->
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>

            <!-- Three carousel slides with the first carousel being active -->
            <!-- carousel-inner is container for all slides -->
            <div class="carousel-inner">
              <!-- carousel-item is each slide -->
              <div class="carousel-item active">
                <img src="../../public/logo.png" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </div>

              <div class="carousel-item">
                <img src="../../public/Carrot Cake Image.jpg" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </div>

              <div class="carousel-item">
                <img src="../../public/Egg and Bread Image.jpg" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </div>

              <div class="carousel-item">
                <img src="../../public/Egg Fried Rice Image.jpg" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </div>

              <div class="carousel-item">
                <img src="../../public/Pasta Image.jpg" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </div>

              <div class="carousel-item">
                <img src="../../public/Shakshuka Image.jpg" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </div>
            </div>

            <!-- buttons to navigate the slides manually -->
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>

            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>
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

.login-btn {
  border: 1px solid black;
  padding: 6px 16px;
  border-radius: 9999px;
}

.login-btn:hover {
  background-color: black;
  color: white;
}

/* HERO SECTION */
main {
  flex-grow: 1;
}

.hero {
  text-align: center;
  padding: 80px 16px;
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
.carousel-section {
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
