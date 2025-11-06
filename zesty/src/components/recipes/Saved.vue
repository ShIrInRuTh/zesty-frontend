<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="carousel-loading">
      <div class="loading-icon">🍰</div>
      <p class="loading-text">
        {{
          loadingPhase === 'coming'
            ? 'Fetching your favourite recipes…'
            : 'Almost there! Sweet treats incoming ✨'
        }}
      </p>
    </div>

    <!-- Empty state -->
    <div v-else-if="recipes.length === 0" class="carousel-loading">
      <div class="loading-icon">😢</div>
      <p class="loading-text">
        You don’t have any liked recipes yet.<br />
        Start exploring and add some favourites!
      </p>
    </div>

    <!-- Carousel only renders when loading is done and recipes exist -->
    <div v-else class="showpiece-carousel">
      <!-- Previous faded small card -->
      <div class="side-card prev-card" v-if="prevRecipeObj">
        <img :src="prevRecipeObj.image_url" alt="Prev Recipe" class="side-img" />
        <div class="side-title">{{ prevRecipeObj.title }}</div>
      </div>

      <!-- Main showpiece card -->
      <div class="showpiece-card clean-card">
        <img
          class="showpiece-img"
          :src="
            currentRecipe?.image_url ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
          "
          :alt="currentRecipe?.title || 'Untitled Recipe'"
        />

        <div class="showpiece-info">
          <!-- 🟢 Added recipe number tag -->
          <div class="recipe-number-tag">Recipe {{ idx + 1 }} of {{ recipes.length }}</div>

          <h2 class="showpiece-title">{{ currentRecipe?.title || 'Untitled Recipe' }}</h2>

          <div class="showpiece-meta">
            <span class="meta">⏲ {{ currentRecipe?.cook_time || '-' }}</span>
            <span class="meta">🔥 {{ currentRecipe?.total_calories || '-' }} kcal</span>
          </div>

          <div class="showpiece-ingredients">
            <div class="sp-label">Ingredients Summary:</div>
            <div class="sp-fridge">🧊 {{ currentRecipe?.inFridgeCount || 0 }} in fridge</div>
            <div v-if="currentRecipe?.expiringSoonCount > 0" class="sp-expiring">
              ⏳ {{ currentRecipe?.expiringSoonCount }} expiring soon:
              <div class="sp-expiring-chips">
                <span
                  v-for="(item, idx) in currentRecipe?.expiringSoonMatchedNames"
                  :key="idx"
                  class="expiring-chip"
                >
                  {{ item }}
                </span>
              </div>
            </div>
            <div v-else class="sp-fresh">🌿 All good — nothing expiring soon!</div>
          </div>

          <div class="showpiece-rating">
            <button :class="buttonClass" @click="showDetails(currentRecipe)">
              {{ buttonText }}
            </button>

            <button
              class="like-btn"
              :class="{ liked: currentRecipe?.liked }"
              @click="toggleLike(currentRecipe)"
            >
              ❤
            </button>
          </div>
        </div>
      </div>

      <!-- Next faded small card -->
      <div class="side-card next-card" v-if="nextRecipeObj">
        <img :src="nextRecipeObj.image_url" alt="Next Recipe" class="side-img" />
        <div class="side-title">{{ nextRecipeObj.title }}</div>
      </div>
    </div>

    <!-- Navigation buttons -->
    <div v-if="!loading && recipes.length > 0" class="carousel-controls">
      <button @click="prevRecipe" class="nav-btn left" aria-label="Previous Recipe">&lt;</button>
      <button @click="nextRecipe" class="nav-btn right" aria-label="Next Recipe">&gt;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const fridgeId = sessionStorage.getItem('fridgeId')
const user_id = sessionStorage.getItem('user_id')
const recipes = ref([])
const idx = ref(0)
const loading = ref(true)
const loadingPhase = ref('coming') // 'coming' | 'almost'
const router = useRouter()

const savedRecipes = async () => {
  loading.value = true
  loadingPhase.value = 'coming'

  // Optional “almost ready” switch
  setTimeout(() => {
    if (loading.value) loadingPhase.value = 'almost'
  }, 6000)

  try {
    const response = await axios.get(
      `http://localhost:8000/api/recipe/like/${user_id}/${fridgeId}`,
      { headers: { 'Content-Type': 'application/json' } },
    )

    console.log('✅ API response:', response.data)

    if (response.status === 200 && Array.isArray(response.data.data)) {
      recipes.value = response.data.data
      console.log('✅ Recipes ref updated:', recipes.value)
    } else {
      console.warn('⚠️ Unexpected response format:', response.data)
      recipes.value = []
    }
  } catch (error) {
    console.error('❌ Error fetching recipes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  savedRecipes()
})

const currentRecipe = computed(() => recipes.value[idx.value] || null)
const prevRecipeObj = computed(() => {
  const len = recipes.value.length
  if (len <= 2) return idx.value > 0 ? recipes.value[idx.value - 1] : null
  return recipes.value[(idx.value - 1 + len) % len]
})
const nextRecipeObj = computed(() => {
  const len = recipes.value.length
  if (len <= 2) return idx.value < len - 1 ? recipes.value[idx.value + 1] : null
  return recipes.value[(idx.value + 1) % len]
})

function prevRecipe() {
  const len = recipes.value.length
  if (len <= 2) {
    if (idx.value > 0) idx.value--
  } else {
    idx.value = (idx.value - 1 + len) % len
  }
}

function nextRecipe() {
  const len = recipes.value.length
  if (len <= 2) {
    if (idx.value < len - 1) idx.value++
  } else {
    idx.value = (idx.value + 1) % len
  }
}

async function toggleLike(recipe) {
  const data = { user_id, name: recipe.title }
  const response = await axios.put('http://localhost:8000/api/recipe/like', data, {
    headers: { 'Content-Type': 'application/json' },
  })
  if (response.status == 200) savedRecipes()
}

const buttonText = computed(() => {
  const status = currentRecipe.value?.status
  if (status === 'in progress') return 'Continue Recipe'
  if (status === 'completed') return 'Try Again'
  return 'Try Recipe'
})
const buttonClass = computed(() => {
  const status = currentRecipe.value?.status
  if (status === 'in progress') return 'sp-try-btn in-progress'
  if (status === 'completed') return 'sp-try-btn completed'
  return 'sp-try-btn'
})

const showDetails = async (recipe) => {
  try {
    console.log('📖 Viewing recipe:', recipe.title)

    const response = await axios.post(
      'http://localhost:8000/api/recipe/new',
      {
        recipe: {
          user_id,
          title: recipe.title,
          serving_size: recipe.serving_size,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          total_calories: recipe.total_calories,
          ingredients_list: recipe.ingredients_list,
          instructions: recipe.instructions,
          notes: recipe.notes,
          image_url: recipe.image_url,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    console.log('✅ Details response:', response.data, response.data.data[0].id)
    router.push(`/recipeDetails/${response.data.data[0].id}`)
  } catch (error) {
    console.error('❌ Error showing details:', error)
  }
}
</script>

<style scoped>
/* 🟢 Added styling for recipe number */
.recipe-number-tag {
  background: #fceccf;
  color: #7a5a32;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(200, 150, 90, 0.15);
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: inline-block;
}
.showpiece-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 54px 0 32px 0;
  gap: 32px;
}
.side-card {
  width: 110px;
  min-height: 130px;
  background: #f5e9d5;
  border-radius: 29px;
  box-shadow: 0 2px 16px 0 #e1c99a;
  opacity: 0.47;
  filter: blur(0.5px) grayscale(0.18) brightness(1.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 7px;
  transition:
    opacity 0.21s,
    box-shadow 0.21s,
    filter 0.19s;
}
.side-img {
  width: 96px;
  height: 78px;
  border-radius: 17px;
  object-fit: cover;
  margin-bottom: 6px;
  box-shadow: 0 1px 6px 0 #fbe7a7;
}
.side-title {
  font-size: 10px;
  color: #826c58;
  font-weight: 800;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
/* Main showpiece card styles unchanged */
.showpiece-card {
  margin: 0 0.5vw;
  background: linear-gradient(120deg, #fff9ec 96%, #ead9c9 100%);
  border-radius: 42px 46px 37px 50px/50px 42px 48px 40px;
  box-shadow: 0 8px 48px 9px rgba(210, 170, 110, 0.18);
  width: 425px;
  min-height: 410px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 32px 28px 32px;
  transition:
    box-shadow 0.16s,
    transform 0.16s;
}
.showpiece-card:hover {
  box-shadow:
    inset 0 0 40px 15px #ffebbc,
    inset 0 0 60px 10px #ff8012;
}
.showpiece-img {
  width: 195px;
  height: 148px;
  object-fit: cover;
  border-radius: 27px;
  margin-bottom: 24px;
  box-shadow: 0 10px 28px 0 #ffeccb;
  background: #f9e7bb;
}
.showpiece-info {
  text-align: center;
}
.showpiece-title {
  font-weight: 900;
  font-size: 2.1rem;
  color: #3b3926;
  margin: 6px 0 12px 0;
  font-family: 'Bricolage Grotesque', Arial, sans-serif;
}
.showpiece-meta {
  margin: 10px 0 18px 0;
  display: flex;
  gap: 14px;
  justify-content: center;
}
.like-btn {
  border: none;
  background: #ffd8e5;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: #e49e7b;
  font-size: 1.48rem;
  cursor: pointer;
  box-shadow: 0 2.4px 8px rgba(235, 195, 140, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.16s,
    color 0.14s;
}
.like-btn.liked {
  background: #ffd1db;
  color: #da2d52;
}
.like-btn:hover {
  background: #e44a5c;
  color: white;
}
.carousel-controls {
  margin-top: 18px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.meta {
  background: #f6e8d8;
  border-radius: 16px;
  font-size: 14px;
  padding: 7px 16px;
  color: #866a40;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.showpiece-ingredients {
  background: #e7f2de;
  margin: 10px 0 7px 0;
  font-size: 13px;
  color: #60805c;
  font-weight: 700;
  padding: 11px 17px;
  border-radius: 13px;
  display: inline-block;
}
.sp-label {
  font-weight: 700;
  margin-right: 5px;
  color: #637147;
}
.sp-fridge {
  color: #3c7e49;
  font-weight: 900;
}
.showpiece-rating {
  margin: 11px 0 15px 0;
  font-size: 1.18rem;
  color: #4a693a;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.sp-try-btn {
  background: linear-gradient(96deg, #ead397 0%, #fff4d4 100%);
  color: #3b4e2e;
  border: none;
  border-radius: 17px;
  font-size: 1.12rem;
  font-family: 'Bricolage Grotesque', Arial, sans-serif;
  font-weight: 700;
  padding: 11px 27px;
  box-shadow:
    0 0 16px 3px #fff6cc,
    0 3px 12px rgba(220, 200, 120, 0.12);
  cursor: pointer;
  margin: 0 10px;
  transition:
    box-shadow 0.18s,
    transform 0.15s;
}
.sp-try-btn:hover {
  background: #3b4e2e;
  color: white;
  transform: scale(1.08);
  box-shadow:
    0 0 34px 11px #fee8b9,
    0 6px 20px rgba(230, 200, 110, 0.18);
}

/* 🟠 In-progress (orange) */
.sp-try-btn.in-progress {
  background: linear-gradient(96deg, #ffae42 0%, #ffd699 100%);
  color: #4b2800;
  box-shadow:
    0 0 16px 3px #ffe6b3,
    0 3px 12px rgba(255, 180, 90, 0.2);
}
.sp-try-btn.in-progress:hover {
  background: #e68600;
  color: white;
  transform: scale(1.08);
  box-shadow:
    0 0 34px 11px #ffcf7f,
    0 6px 20px rgba(255, 150, 50, 0.18);
}

/* 🟢 Completed (green) */
.sp-try-btn.completed {
  background: linear-gradient(96deg, #7acb6f 0%, #d8f7a8 100%);
  color: #203b1a;
  box-shadow:
    0 0 16px 3px #eaffb0,
    0 3px 12px rgba(100, 180, 90, 0.2);
}
.sp-try-btn.completed:hover {
  background: #dbb20e;
  color: #1b1a1a;
  transform: scale(1.08);
  box-shadow:
    0 0 34px 11px #f6ffba,
    0 6px 20px rgba(130, 180, 80, 0.18);
}

.carousel-controls {
  margin-top: 17px;
  display: flex;
  gap: 11px;
  justify-content: center;
}
.nav-btn {
  background: #fbe7a7;
  border: none;
  font-size: 2.2rem;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  color: #c18e3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 11px #fdebc7;
}
.nav-btn:hover {
  filter: brightness(0.92) contrast(1.13);
}
@media (max-width: 900px) {
  .showpiece-card {
    width: 96vw;
  }
}
@media (max-width: 650px) {
  .showpiece-carousel {
    flex-direction: column;
    gap: 14px;
  }
  .showpiece-card {
    width: 95vw;
    padding: 12vw 2vw 12vw 2vw;
    min-height: 280px;
  }
  .side-card {
    display: none;
  }
}

.sp-label {
  font-weight: 700;
  margin-right: 5px;
  color: #637147;
  font-size: 14px;
}

.sp-fridge {
  margin-top: 4px;
  font-size: 14px;
  color: #3c7e49;
  font-weight: 700;
}

.sp-expiring {
  margin-top: 8px;
  font-size: 13px;
  color: #b45f2a;
  font-weight: 700;
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
  font-size: 13px;
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
  font-size: 13px;
  color: #5e7841;
  font-style: italic;
  font-weight: 600;
}
.carousel-loading {
  text-align: center;
  margin: 60px 0;
  color: #bc7e4e;
  font-family: 'Bricolage Grotesque', sans-serif;
}

.carousel-loading .loading-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: bounce 1s infinite alternate;
}

.carousel-loading .loading-text {
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
