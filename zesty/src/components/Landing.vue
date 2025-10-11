<template>
  <div class="app">
    <!-- HEADER -->
    <Header>

    </Header>

    <!-- Dramatic Intro Screen -->
    <transition name="fade">
      <div v-if="showIntro" class="intro">
        <img src="../../public/Food Diet Icon.png" alt="Zesty Logo" />
        <h1 class="logo">ZESTY</h1>
        <p>Where food wastage knows no bounds</p>
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
              Discover bold flavours, creative recipes, and a pinch of sass. Zesty is your ultimate
              cooking companion.
            </p>
            <RouterLink to="/recipes" class="explore-btn">Explore Recipes</RouterLink>
          </div>

          <!-- CAROUSEL SECTION -->
          <section class="carousel-section" id="feature">
            <div class="mx-auto box">
              <!-- set the carousel -->
              <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                  <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
                </div>

                <div class="carousel-inner">
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
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the
                      card's
                      content.</p>
                    <a href="http://sunjun.site" class="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
        <!-- FOOTER -->
        <Footer>

        </Footer>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'
import Header from './common/Header.vue';
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
      this.showIntro = false
    }, 2500)
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque&family=Plus+Jakarta+Sans:wght@400;600&display=swap');

.app {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: black;
  background-color: white;
  margin: 0;
}

/* --- Fullscreen intro overlay --- */
.intro {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 60% 40%, rgba(255, 255, 255, 0.24) 0%, transparent 60%),
    /* glossy highlight */
    radial-gradient(ellipse at 40% 70%, rgba(255, 255, 255, 0.12) 0%, transparent 65%),
    /* bottom-left soft gloss */
    radial-gradient(circle at 50% 47%, #ffece0 0%, #ffd8af 45%, #ffba7c 78%, #ffb786 100%);
  background-color: #fff1e5;
  color: #3b2f2f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  box-shadow: 0 0 0 100vw rgba(255, 193, 125, 0.04) inset;
  animation: pulse 2.5s ease-in-out infinite alternate;
  backdrop-filter: blur(1.2px) brightness(1.03);
}

@keyframes pulse {
  from {
    background:
      radial-gradient(ellipse at 65% 35%, rgba(255, 255, 255, 0.22) 0%, transparent 60%),
      radial-gradient(ellipse at 47% 80%, rgba(255, 255, 255, 0.11) 0%, transparent 65%),
      radial-gradient(circle at 50% 50%, #fff6ea 0%, #ffd8af 47%, #ffc38e 80%, #ffb786 100%);
  }

  to {
    background:
      radial-gradient(ellipse at 60% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 58%),
      radial-gradient(ellipse at 45% 82%, rgba(255, 255, 255, 0.07) 0%, transparent 60%),
      radial-gradient(circle at 51% 49%, #ffece0 0%, #ffe0bd 52%, #ffba7c 85%, #ffc89d 100%);
  }
}

/* Logo/text enhancements for aesthetics */
.logo {
  font-size: 5rem;
  letter-spacing: 0.11em;
  font-weight: 900;
  text-transform: uppercase;
  font-family: 'Bricolage Grotesque', sans-serif;
  text-shadow:
    0 4px 24px rgba(255, 195, 125, 0.12),
    0 1px 4px rgba(0, 0, 0, 0.06);
  animation: zoomOut 5s ease-in-out forwards;
  filter: drop-shadow(0 2px 6px rgba(255, 190, 140, 0.15));
  border-radius: 38px;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.1em 0.45em;
}

.intro p {
  font-size: 1.07rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  font-family: 'Bricolage Grotesque', sans-serif;
  text-shadow:
    0 2px 16px rgba(255, 220, 170, 0.13),
    0 1px 2px rgba(0, 0, 0, 0.07);
  animation: fadeOut 5s ease-in-out forwards;
}

.intro img {
  width: 250px;
  height: 200px;
  filter: brightness(1.04) saturate(1.08);
  animation: fadeOut 5s ease-in-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

/* --- Landing page --- */
.landing {
  opacity: 0;
  animation: fadeIn 1s 2.5s ease-in-out forwards;
  min-height: 100vh;
  background: #fff;
  color: #333;
  text-align: center;
  padding-top: 20vh;
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
  z-index: 2;
  padding: 2rem;
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
</style>
