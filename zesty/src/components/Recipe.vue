<template>
  <div class="app">
    <Header />
    <div class="main-content">
      <h1>Recipes</h1>
      <!-- Tab Nav Bar -->
      <div class="tab-bar-bg">
        <nav class="tab-bar">
          <button :class="{ active: activeTab === 'discover' }" @click="activeTab = 'discover'">
            Discover
          </button>
          <button :class="{ active: activeTab === 'saved' }" @click="activeTab = 'saved'">
            Saved Recipies
          </button>
          <button :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
            History
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'discover'">
        <Discover />
      </div>
      <div v-if="activeTab === 'saved'">
        <Saved />
      </div>
      <div v-if="activeTab === 'history'">
        <History />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'
import Discover from './recipes/Discover.vue'
import Saved from './recipes/Saved.vue'
import History from './recipes/History.vue'
const activeTab = ref('discover')
const searchQuery = ref('')
</script>

<style scoped>
html,
body,
#app,
.app {
  min-width: 100vw;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
}

.main-content h1 {
  color: #ea563b;
  font-size: 3rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: bold;
  margin: 26px 0 18px 8px;
  text-align: center;
}

.main-content {
  width: 100vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 50px;
}
.tab-bar-bg {
  width: fit-content;
  margin: 32px auto 28px auto;
  background: #dbc09c;
  border-radius: 18px;
  padding: 15px 18px;
  display: flex;
  align-items: center;
}

.tab-bar {
  display: flex;
  gap: 48px;
}

.tab-bar button {
  background: transparent;
  color: #222;
  border: none;
  outline: none;
  border-radius: 13px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.15s;
}

.tab-bar button.active {
  background: #44704d;
  color: #fff;
}

.tab-bar button:not(.active):hover {
  background: #d5bd98;
}

.search {
  display: flex;
  align-items: center;
  background: #e6dcc7;
  border-radius: 22px;
  width: 80vw;
  max-width: 500px;
  margin: 0 auto 26px;
  padding: 12px 20px;
  box-sizing: border-box;
  position: relative;
}
.search input {
  background: transparent;
  border: none;
  font-size: 14px;
  width: 100%;
  padding: 8px 0;
  outline: none;
}
.search-icon {
  font-size: 22px;
  color: #71644e;
  cursor: pointer;
}
.section {
  width: 100vw;
  padding-left: 3vw;
  margin: auto;
  box-sizing: border-box;
}
.section-title {
  color: #ea563b;
  font-size: 2rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: bold;
  margin: 26px 0 0 8px;
  text-align: center;
}
.card-row {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  margin-left: 8px;
  width: 95vw;
}
.card {
  background: #dbc09c;
  border-radius: 23px;
  width: 160px;
  min-width: 120px;
  height: 140px;
  box-shadow: 0 2px 8px rgba(90, 60, 30, 0.07);
}
@media (max-width: 900px) {
  .card {
    width: 22vw;
    min-width: 88px;
  }
  .tab-bar button {
    max-width: none;
    padding: 12px 0.6em;
    font-size: 1rem;
  }
}
@media (max-width: 600px) {
  .section,
  .card-row {
    padding-left: 0;
  }
  .card-row {
    justify-content: center;
    gap: 12px;
  }
  .section {
    width: 100vw;
  }
  .card {
    width: 26vw;
  }
}
.card-row {
  display: flex;
  flex-direction: row;
  gap: 32px;
  flex-wrap: wrap; /* Cards will wrap to next line on small screens */
  padding: 12px 0;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  overflow-x: auto; /* Optional: enables horizontal scroll on overflow */
}

.kitchen-card {
  background: linear-gradient(135deg, #fff9ec 90%, #ead9c9 100%);
  border: 2.3px solid #e6d1b1;
  border-radius: 38px 42px 33px 44px/40px 36px 40px 38px;
  width: 315px;
  min-height: 340px;
  margin: 40px 24px 0 0;
  box-shadow: 0 8px 48px 3px rgba(210, 170, 110, 0.19);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 22px 20px;
  font-family: 'Bricolage Grotesque', 'Comic Sans MS', Arial, sans-serif;
  position: relative;
  transition:
    box-shadow 0.16s,
    transform 0.16s;
  width: 400px;
}
.kitchen-card:hover {
  /* Outer shadow removed */
  box-shadow:
    inset 0 0 40px 15px #ffebbc,
    inset 0 0 60px 10px #daa86e;
}

.kc-image-wrap {
  width: 142px;
  height: 120px;
  border-radius: 28px;
  overflow: hidden;
  margin-bottom: 11px;
  box-shadow: 0 2px 14px 0 rgba(230, 200, 140, 0.17);
  background: #f9e7bb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kc-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
}

.kc-title {
  font-weight: 900;
  font-size: 2rem;
  color: #3b3926;
  letter-spacing: 0.03em;
  margin: 14px 0 8px 0;
  text-align: center;
  font-family: 'Bricolage Grotesque', 'Comic Sans MS', Arial, sans-serif;
}

.kc-meta-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
}
.kc-meta {
  background: #f4e3d4;
  border-radius: 18px 16px 20px 15px/20px 22px 15px 18px;
  font-size: 12px;
  padding: 9px 19px;
  color: #866a40;
  font-weight: 600;
  box-shadow: 0 1.5px 6px rgba(180, 120, 60, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.icon {
  font-size: 1.2em;
  margin-right: 5px;
}

.kc-ingredients {
  background: #e7f2de;
  margin: 13px 0;
  font-size: 12px;
  color: #60805c;
  font-weight: 700;
  box-shadow: 0 1.5px 4px rgba(120, 170, 100, 0.08);
  padding: 10px 18px;
  display: flex;
  gap: 6px;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-radius: 10px;
}

.kc-label-blobby {
  font-weight: bold;
  margin-right: 4px;
  color: #637147;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.kc-fridge-amt {
  font-weight: 700;
  color: #3c7e49;
}

.kc-bottom-row {
  margin-top: 18px;
  display: flex;
  width: 92%;
  align-items: center;
  justify-content: space-between;
}

.kc-try-btn {
  background: linear-gradient(96deg, #ead397 0%, #fff4d4 100%);
  color: #3b4e2e;
  border: none;
  border-radius: 18px;
  font-size: 1.09rem;
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', Arial, sans-serif;
  font-weight: 700;
  padding: 10px 28px;
  box-shadow:
    0 0 14px 2px #fff6cc,
    0 2px 8px rgba(220, 200, 120, 0.09);
  cursor: pointer;
  margin: 0 18px;
  position: relative;
  transition:
    box-shadow 0.16s,
    transform 0.13s;
}

.kc-try-btn:hover {
  background: #3b4e2e;
  color: white;
  box-shadow:
    0 0 28px 7px #fbe6a7,
    0 6px 14px rgba(220, 190, 110, 0.19);
  transform: scale(1.07);
}

.kc-rating {
  font-size: 1.17rem;
  color: #4a693a;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 2px;
}

.kc-like-btn {
  border: none;
  background: #ffe5e7;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #e49e7b;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(235, 195, 140, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.14s,
    color 0.12s;
}
.kc-like-btn.liked {
  background: #ffcad3;
  color: #e44a5c;
}
</style>
