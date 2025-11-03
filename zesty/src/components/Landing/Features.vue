<script>
export default {
  data() {
    return {
      // Features
      features: [
        {
          title: 'My Recipes',
          image: '../../public/reciepes_discover/avocado_toast.jpg',
          subFeatures: [
            { icon: '🔍', text: 'Discover' },
            { icon: '💾', text: 'Saved' },
            { icon: '📜', text: 'History' },
          ],
          summary: 'Find, save and rediscover your next favourite meal.',
        },
        {
          title: 'My Fridge',
          image:
            '../../public/noodles-spicy-frying-pans-with-ingredients-black-cement-surface-top-view.jpg',
          subFeatures: [
            { icon: '⏰', text: 'Track' },
            { icon: '🧺', text: 'Manage' },
          ],
          summary: 'Tracking and managing ingredients at home.',
        },
        {
          title: 'My Food Graveyard',
          image: '../../public/reciepes_discover/berry_pancakes.jpg',
          subFeatures: [{ icon: '💀', text: 'Expired' }],
          summary: 'Encouraging sustainable, zero-waste habits.',
        },
      ],
    }
  },
}
</script>

<template>
  <!-- Features Sections -->
  <div class="section">
    <h2 class="section-title">Features for you</h2>
    <div class="card-row">
      <div class="kitchen-card" v-for="(recipe, idx) in features" :key="'recipe-' + idx">
        <div class="kc-image-wrap">
          <img class="kc-image" :src="recipe.image" alt="Recipe Photo" />
        </div>
        <div class="kc-title">{{ recipe.title }}</div>
        <div class="kc-subFeatures-row">
          <span
            v-for="subFeatures in recipe.subFeatures"
            :key="subFeatures.text"
            class="kc-subFeatures"
          >
            <span class="icon">{{ subFeatures.icon }}</span> {{ subFeatures.text }}
          </span>
        </div>
        <div class="kc-summary">
          <span class="kc-label-blobby">Summary:</span>
          <span class="kc-fridge-amt">{{ recipe.summary }}</span>
        </div>
        <div class="kc-bottom-row">
          <button class="kc-moreDetails-btn" v-on:click="$emit('open-popup', idx)">
            More Details {{ idx }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const searchQuery = ref('')
</script>

<style scoped>
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
  flex-wrap: wrap;
  /* Cards will wrap to next line on small screens */
  padding: 12px 0;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  overflow-x: auto;
  /* Optional: enables horizontal scroll on overflow */
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

.kc-subFeatures-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
}

.kc-subFeatures {
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

.kc-summary {
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
  justify-content: center;
}

.kc-moreDetails-btn {
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

.kc-moreDetails-btn:hover {
  background: #3b4e2e;
  color: white;
  box-shadow:
    0 0 28px 7px #fbe6a7,
    0 6px 14px rgba(220, 190, 110, 0.19);
  transform: scale(1.07);
}
</style>
