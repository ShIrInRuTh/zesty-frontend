<template>
  <!-- Search Box -->
  <div class="search">
    <input type="text" placeholder="Look for recipes" v-model="searchQuery" />
    <span class="search-icon">🔍</span>
  </div>
  <div class="section container-fluid">
    <h2 class="section-title">Curated for you</h2>
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-icon">🍳</div>
      <p class="loading-text">
        {{
          loadingPhase === 'coming'
            ? 'Your recipe is coming…'
            : 'Almost ready! Just a pinch of magic ✨'
        }}
      </p>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="(recipe, index) in curated" :key="index">
        <div class="showpiece-card clean-card">
          <!-- Recipe Image -->
          <img
            class="showpiece-img"
            :src="
              recipe.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
            "
            :alt="recipe.title"
          />

          <div class="showpiece-info">
            <!-- Recipe Title -->
            <h2 class="showpiece-title">{{ recipe.title || 'Untitled Recipe' }}</h2>

            <!-- Meta Row -->
            <div class="showpiece-meta">
              <span class="meta">⏲ {{ recipe.prepTime || '-' }}</span>
              <span class="meta">🔥 {{ recipe.total_calories || '-' }} kcal</span>
            </div>

            <!-- Ingredients List -->
            <!-- Ingredients List -->
            <div class="showpiece-ingredients">
              <span class="sp-label">Ingredients (expiring soon):</span>

              <div v-if="recipe.expiring_ingredients_used?.length" class="sp-expiring-chips">
                <span
                  v-for="(item, idx) in recipe.expiring_ingredients_used"
                  :key="idx"
                  class="expiring-chip"
                >
                  {{ item }}
                </span>
              </div>
              <div v-else class="sp-fresh">🌿 Nothing expiring soon!</div>

              <small v-if="recipe.expiring_ingredients_used?.length" class="kc-fridge-amt">
                Expiring in ~2 weeks
              </small>
            </div>

            <!-- Rating / Buttons -->
            <div class="showpiece-rating">
              <button class="sp-try-btn">Try Recipe</button>
              <button class="like-btn" :class="{ liked: recipe.liked }" @click="toggleLike(recipe)">
                ❤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const curated = ref([])
const fridgeId = sessionStorage.getItem('fridgeId')
const user_id = sessionStorage.getItem('user_id')
const loading = ref(true) // overall loading
const loadingPhase = ref('coming') // 'coming' | 'almost'

const curatedRecipes = async () => {
  try {
    loading.value = true
    loadingPhase.value = 'coming'

    // Simulate first loading message
    setTimeout(() => {
      if (loading.value) loadingPhase.value = 'almost'
    }, 6000)

    const response = await axios.post(
      'http://localhost:8000/api/recipe',
      {
        numRecipe: 10,
        serving: 1,
        ingredientArr: [],
        mealType: 'Any',
        cookingMethod: 'Any',
        vegan: null,
        halal: null,
        allergy: 'None',
        instructions: 'Discover interesting recipes matching general preferences.',
        fridgeId: fridgeId,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )
    curated.value = response.data || []
  } catch (error) {
    console.error(error)
  } finally {
    // ✅ Hide loading once recipes are generated
    loading.value = false
  }
}

onMounted(() => curatedRecipes())

async function toggleLike(recipe) {
  if (recipe.liked) {
    const data = {
      user_id,
      name: recipe.title,
    }
    const response = await axios.put('http://localhost:8000/api/recipe/like', data, {
      headers: { 'Content-Type': 'application/json' },
    })
    if (response.status == 200) {
      recipe.liked = !recipe.liked
    }
  } else {
    recipe.liked = !recipe.liked
    const data = {
      user_id,
      title: recipe.title,
      serving_size: recipe.yields,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      total_calories: recipe.total_calories,
      ingredients_list: recipe.ingredients_list,
      instructions: recipe.instructions,
      notes: recipe.notes,
      image_url: recipe.image_url,
    }
    const response = await axios.post('http://localhost:8000/api/recipe/like', data, {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
</script>

<style scoped>
/* Reuse showpiece aesthetic */
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
  margin: 26px 0 26px 8px;
  text-align: center;
}
.clean-card {
  background: linear-gradient(120deg, #fff9ec 96%, #ead9c9 100%);
  border-radius: 42px 46px 37px 50px/50px 42px 48px 40px;
  box-shadow: 0 8px 48px 9px rgba(210, 170, 110, 0.18);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition:
    box-shadow 0.16s,
    transform 0.16s;
  width: 90%;
}
.clean-card:hover {
  box-shadow:
    inset 0 0 40px 15px #ffebbc,
    inset 0 0 60px 10px #ff8012;
}

.showpiece-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 27px;
  margin-bottom: 24px;
  box-shadow: 0 10px 28px 0 #ffeccb;
  background: #f9e7bb;
}

.showpiece-info {
  text-align: center;
  width: 100%;
}

.showpiece-title {
  font-weight: 900;
  font-size: 1.5rem;
  color: #3b3926;
  margin-bottom: 16px;
  font-family: 'Bricolage Grotesque', Arial, sans-serif;
}

.showpiece-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}
.meta {
  background: #f6e8d8;
  border-radius: 16px;
  font-size: 0.9rem;
  padding: 6px 12px;
  color: #866a40;
  font-weight: 600;
}

.showpiece-ingredients {
  background: #e7f2de;
  padding: 8px 14px;
  width: 50%;
  border-radius: 13px;
  font-weight: 700;
  color: #3c7e49;
  font-size: 10px;
  margin: auto auto 16px auto;
}
.sp-label {
  font-weight: 700;
  margin-right: 6px;
}
.sp-ingredient-list {
  list-style-type: disc;
  padding-left: 18px;
  text-align: left;
  margin: 4px 0;
}
.kc-fridge-amt {
  display: block;
  font-size: 8px;
  font-weight: 600;
  color: #60805c;
  margin-top: 4px;
}

.showpiece-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.sp-try-btn {
  background: linear-gradient(96deg, #ead397 0%, #fff4d4 100%);
  color: #3b4e2e;
  border: none;
  border-radius: 17px;
  font-size: 1rem;
  font-weight: 700;
  padding: 8px 22px;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'Bricolage Grotesque', Arial, sans-serif;
}
.sp-try-btn:hover {
  background: #3b4e2e;
  color: white;
  transform: scale(1.08);
}

.like-btn {
  border: none;
  background: #ffd8e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #e49e7b;
  font-size: 1.3rem;
  cursor: pointer;
}
.like-btn.liked {
  background: #ffd1db;
  color: #da2d52;
}
.like-btn:hover {
  background: #e44a5c;
  color: white;
}

.sp-expiring-chips {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.expiring-chip {
  background: linear-gradient(135deg, #ffefdf 0%, #ffd6b3 100%);
  color: #a14600;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(250, 160, 80, 0.2);
  transition: transform 0.2s ease;
}

.expiring-chip:hover {
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(255, 140, 0, 0.28);
}

.sp-fresh {
  margin-top: 6px;
  font-size: 12px;
  color: #5e7841;
  font-style: italic;
  font-weight: 600;
  text-align: center;
}

.loading-state {
  text-align: center;
  margin: 60px 0;
  color: #bc7e4e;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.loading-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: bounce 1s infinite alternate;
}
.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
