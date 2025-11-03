<template>
  <section class="section">
    <div class="section-title">🥘 Your Cooking History</div>

    <!-- Empty State -->
    <div v-if="!inProgress.length && !completed.length" class="empty-history">
      <div class="empty-illustration">🍳</div>
      <p class="empty-message">
        Nothing cooked yet! <br />
        Start your culinary adventure today! 🌿
      </p>
    </div>

    <!-- In Progress Section -->
    <div v-if="inProgress.length" class="history-section">
      <h3 class="history-subtitle">In Progress</h3>
      <div class="history-card-stack">
        <transition-group name="slide-fade" tag="div">
          <div v-for="recipe in inProgress" :key="recipe.title" class="wide-card in-progress">
            <div class="wide-card-content">
              <div class="wide-img-wrap">
                <img
                  :src="
                    recipe.image_url ||
                    recipe.image ||
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
                  "
                  :alt="recipe.title"
                  class="wide-card-img"
                />
              </div>
              <div class="wide-details">
                <div class="wide-title">{{ recipe.title }}</div>

                <div class="wide-meta-row">
                  <span class="wide-meta">⏲ {{ recipe.cook_time || '-' }}</span>
                  <span class="wide-meta">🔥 {{ recipe.total_calories || '-' }} kcal</span>
                </div>

                <div class="wide-ingredients">
                  <span class="sp-label">Ingredients (expiring soon):</span>

                  <!-- Expiring Ingredients -->
                  <div v-if="recipe.expiringSoonMatchedNames?.length" class="sp-expiring-chips">
                    <span
                      v-for="(item, idx) in recipe.expiringSoonMatchedNames"
                      :key="idx"
                      class="expiring-chip"
                    >
                      {{ item }}
                    </span>
                  </div>
                  <div v-else class="sp-fresh">🌿 Nothing expiring soon!</div>
                  <small v-if="recipe.expiringSoonMatchedNames?.length" class="kc-fridge-amt">
                    Expiring in ~2 weeks
                  </small>

                  <!-- Fridge Count -->
                  <small class="fridge-count" v-if="recipe?.inFridgeCount">
                    🧊 {{ recipe?.inFridgeCount }} ingredient(s) in fridge
                  </small>
                </div>
              </div>

              <button class="wide-try-btn in-progress-btn">Continue</button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Completed Section -->
    <div v-if="completed.length" class="history-section">
      <h3 class="history-subtitle">Completed</h3>
      <div class="history-card-stack">
        <transition-group name="slide-fade" tag="div">
          <div v-for="recipe in completed" :key="recipe.title" class="wide-card completed">
            <div class="wide-card-content">
              <div class="wide-img-wrap">
                <img
                  :src="
                    recipe.image_url ||
                    recipe.image ||
                    'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
                  "
                  :alt="recipe.title"
                  class="wide-card-img"
                />
              </div>
              <div class="wide-details">
                <div class="wide-title">{{ recipe.title }}</div>

                <div class="wide-meta-row">
                  <span class="wide-meta">⏲ {{ recipe.prepTime || '-' }}</span>
                  <span class="wide-meta">🔥 {{ recipe.total_calories || '-' }} kcal</span>
                </div>

                <div class="wide-ingredients">
                  <span class="sp-label">Ingredients (expiring soon):</span>

                  <!-- Expiring Ingredients -->
                  <div v-if="recipe.expiringSoonMatchedNames?.length" class="sp-expiring-chips">
                    <span
                      v-for="(item, idx) in recipe.expiringSoonMatchedNames"
                      :key="idx"
                      class="expiring-chip"
                    >
                      {{ item }}
                    </span>
                  </div>
                  <div v-else class="sp-fresh">🌿 Nothing expiring soon!</div>
                  <small v-if="recipe.expiringSoonMatchedNames?.length" class="kc-fridge-amt">
                    Expiring in ~2 weeks
                  </small>

                  <!-- Fridge Count -->
                  <small class="fridge-count" v-if="recipe?.inFridgeCount">
                    🧊 {{ recipe?.inFridgeCount }} ingredient(s) in fridge
                  </small>
                </div>
              </div>

              <button class="wide-try-btn completed-btn">Try Again</button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const fridgeId = sessionStorage.getItem('fridgeId')
const user_id = sessionStorage.getItem('user_id')
const completed = ref([])
const inProgress = ref([])
const historyRecipes = async () => {
  try {
    const completed_res = await axios.get(
      `http://localhost:8000/api/recipe/history/completed/${user_id}/${fridgeId}`,
      { headers: { 'Content-Type': 'application/json' } },
    )
    const ip_res = await axios.get(
      `http://localhost:8000/api/recipe/history/inProgress/${user_id}/${fridgeId}`,
      { headers: { 'Content-Type': 'application/json' } },
    )

    console.log('✅ API response:', completed_res.data, ip_res.data)

    if (completed_res.status === 200 && Array.isArray(completed_res.data.data)) {
      completed.value = completed_res.data.data
      console.log('✅ Recipes ref updated:', completed_res.value)
    } else {
      console.warn('⚠️ Unexpected response format:', completed_res.data)
      completed.value = []
    }
    if (ip_res.status === 200 && Array.isArray(ip_res.data.data)) {
      inProgress.value = ip_res.data.data
      console.log('✅ Recipes ref updated:', ip_res.value)
    } else {
      console.warn('⚠️ Unexpected response format:', ip_res.data)
      inProgress.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching recipes:', error)
  }
}

onMounted(() => {
  historyRecipes()
})

const toggleLike = (recipe) => {
  recipe.liked = !recipe.liked
}
</script>

<style scoped>
.empty-history {
  text-align: center;
  margin: 60px 0;
  color: #bc7e4e; /* soft brown for aesthetics */
  font-family: 'Bricolage Grotesque', sans-serif;
}
.empty-illustration {
  font-size: 4rem;
  margin-bottom: 16px;
}
.empty-message {
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.5;
}

.section {
  width: 100vw;
  box-sizing: border-box;
}
.section-title {
  color: #ea563b;
  font-size: 2rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: bold;
  margin: 28px 0 0 10px;
  text-align: center;
}
.history-subtitle {
  text-align: center;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ea563b;
}
.history-card-stack {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
  margin-top: 16px;
}

/* Wide Card Base Styles */
.wide-card {
  width: 80vw;
  max-width: 1050px;
  min-width: 350px;
  border-radius: 20px;
  transition:
    box-shadow 0.16s,
    transform 0.16s;
  margin-bottom: 20px;
}
.fridge-count {
  display: block;
  font-size: 0.75rem;
  color: #8b6d4c; /* beige/brown to match aesthetic */
  margin-top: 2px;
  font-weight: 600;
}

.wide-card.in-progress {
  background: linear-gradient(105deg, #ffd7a0 80%, #ffc377 100%);
  border: 2.5px solid #ffb74d;
  box-shadow: 0 8px 44px 6px rgba(240, 170, 120, 0.15);
}
.wide-card.completed {
  background: linear-gradient(105deg, #a7e4a0 80%, #88d17f 100%);
  border: 2.5px solid #5cb85c;
  box-shadow: 0 8px 44px 6px rgba(100, 200, 100, 0.15);
}
.wide-card:hover {
  transform: scale(1.02);
}

/* Card Content */
.wide-card-content {
  display: flex;
  align-items: center;
  gap: 33px;
  padding: 25px 38px;
}
.wide-img-wrap {
  width: 69px;
  height: 69px;
  border-radius: 14px;
  overflow: hidden;
  background: #ffe7cd;
  box-shadow: 0 1.5px 12px rgba(230, 200, 140, 0.11);
  display: flex;
  align-items: center;
  justify-content: center;
}
.wide-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 11px;
}
.wide-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 12px;
}
.wide-title {
  font-weight: 900;
  font-size: 1.13rem;
  color: #3b3926;
  letter-spacing: 0.02em;
  font-family: 'Bricolage Grotesque', 'Comic Sans MS', Arial, sans-serif;
}
.wide-meta-row {
  display: flex;
  gap: 13px;
}
.wide-meta {
  background: #fff4ee;
  border-radius: 11px 16px 14px 15px/14px 15px 13px 11px;
  font-size: 13px;
  padding: 7px 14px;
  color: #c68465;
  font-weight: 700;
  display: flex;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.wide-ingredients {
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sp-label {
  font-weight: 700;
  margin-bottom: 4px;
  color: #3b3926;
}
.sp-expiring-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.wide-card .wide-ingredients .expiring-chip {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #eabb9d; /* dark red text */
  background: linear-gradient(135deg, #6b1818); /* red gradient */
  box-shadow: 0 2px 6px rgba(240, 100, 100, 0.25);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  cursor: default;
}

.wide-card .wide-ingredients .expiring-chip:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 12px rgba(240, 100, 100, 0.35);
}
.sp-fresh {
  color: #8b6d4c; /* beige/brown */
  font-weight: 700;
  font-size: 0.88rem;
  background: #c8ffd9; /* light beige background */
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
}
.kc-fridge-amt {
  font-size: 0.75rem;
  color: #bc7e4e;
  margin-top: 2px;
}

.wide-rating {
  font-size: 1.05rem;
  color: #ea563b;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tried-on {
  background: #fff2ea;
  color: #bc7e4e;
  font-size: 0.97rem;
  border-radius: 7px;
  font-weight: 600;
  padding: 4px 12px;
  margin-left: 7px;
}

/* Try Again / Continue Buttons */
.wide-try-btn {
  margin-left: auto;
  border: none;
  border-radius: 14px;
  font-size: 1.08rem;
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', Arial, sans-serif;
  font-weight: 700;
  padding: 13px 40px;
  box-shadow:
    0 1px 13px #ffe7cb,
    0 2px 9px rgba(242, 180, 120, 0.15);
  cursor: pointer;
  transition:
    background 0.14s,
    color 0.13s;
}
.wide-try-btn:hover {
  background: #64190c;
  color: #fff;
  box-shadow:
    0 0 22px 7px #ffd7ae,
    0 4px 9px rgba(250, 210, 140, 0.14);
  transform: scale(1.03) rotate(5deg);
}
.wide-try-btn.in-progress-btn {
  background: #ea563b;
  color: white;
}
.wide-try-btn.completed-btn {
  background: #4caf50;
  color: white;
}

/* Slide-fade animation */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.slide-fade-enter-active {
  transition:
    opacity 0.28s,
    transform 0.33s;
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-active {
  transition:
    opacity 0.14s,
    transform 0.23s;
}

/* Responsive */
@media (max-width: 800px) {
  .wide-card {
    width: 96vw;
    min-width: 92vw;
  }
  .wide-card-content {
    padding: 17px 7vw;
    gap: 14px;
  }
  .wide-details {
    gap: 7px;
  }
  .wide-try-btn {
    padding: 10px 19px;
    font-size: 1.01rem;
  }
}
</style>

<style scoped>
.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #ea563b;
  margin-bottom: 24px;
}
.history-subtitle {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ea563b;
}
.history-card-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

/* Showpiece card styling */
.showpiece-card {
  width: 80vw;
  max-width: 600px;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.1);
}
.status-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 12px;
  border-radius: 12px;
  color: white;
  font-weight: 700;
}
.showpiece-card.in-progress .status-badge {
  background: #ff8c42;
}
.showpiece-card.completed .status-badge {
  background: #4caf50;
}

.showpiece-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.showpiece-info {
  padding: 16px;
}

.showpiece-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #ea563b;
}

.showpiece-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.meta {
  background: #fff4ee;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: #c68465;
}

.icon {
  margin-right: 4px;
}

.showpiece-ingredients {
  margin-bottom: 12px;
}
.sp-label {
  font-weight: 700;
}
.sp-expiring-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.expiring-chip {
  background: #ffd7a0;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.85rem;
}
.sp-fresh {
  color: #4caf50;
  font-weight: 600;
  margin-top: 4px;
}
.kc-fridge-amt {
  font-size: 0.75rem;
  color: #bc7e4e;
}

.showpiece-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.tried-on {
  color: #bc7e4e;
  font-weight: 500;
}

.showpiece-buttons {
  display: flex;
  gap: 12px;
}
.sp-try-btn {
  padding: 10px 24px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.14s ease;
}
.sp-try-btn.in-progress-btn {
  background: #ea563b;
  color: white;
}
.sp-try-btn.completed-btn {
  background: #4caf50;
  color: white;
}
.sp-try-btn:hover {
  transform: scale(1.03);
}
.like-btn {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.like-btn.liked {
  color: red;
}
</style>
