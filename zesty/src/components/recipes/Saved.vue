<template>
  <div class="showpiece-carousel">
    <!-- Previous faded small card -->
    <div class="side-card prev-card" v-if="prevRecipeObj">
      <img :src="prevRecipeObj.image" alt="Prev Recipe" class="side-img" />
      <div class="side-title">{{ prevRecipeObj.title }}</div>
    </div>

    <!-- Main showpiece card -->
    <div class="showpiece-card">
      <img :src="currentRecipe.image" :alt="currentRecipe.title + ' Photo'" class="showpiece-img" />
      <div class="showpiece-info">
        <h2 class="showpiece-title">{{ currentRecipe.title }}</h2>
        <div class="showpiece-meta">
          <span v-for="meta in currentRecipe.meta" :key="meta.text" class="meta"
            >{{ meta.icon }} {{ meta.text }}</span
          >
        </div>
        <div class="showpiece-ingredients">
          <span class="sp-label">Ingredients:</span>
          <span class="sp-fridge">{{ currentRecipe.ingredients }}</span>
        </div>
        <div class="showpiece-rating">
          ⭐ {{ currentRecipe.rating }}
          <button class="sp-try-btn">Try Recipe</button>
          <button
            class="like-btn"
            :class="{ liked: currentRecipe.liked }"
            @click="toggleLike(currentIdx)"
          >
            ❤
          </button>
        </div>
      </div>
    </div>

    <!-- Next faded small card -->
    <div class="side-card next-card" v-if="nextRecipeObj">
      <img :src="nextRecipeObj.image" alt="Next Recipe" class="side-img" />
      <div class="side-title">{{ nextRecipeObj.title }}</div>
    </div>
  </div>

  <!-- Navigation buttons -->
  <div class="carousel-controls">
    <button @click="prevRecipe" class="nav-btn left" aria-label="Previous Recipe">&lt;</button>
    <button @click="nextRecipe" class="nav-btn right" aria-label="Next Recipe">&gt;</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const curated = ref([
  {
    title: 'Avocado Toast',
    image: '../../public/reciepes_discover/avocado_toast.jpg',
    meta: [
      { icon: '⏲', text: '10m' },
      { icon: '🍳', text: 'Western' },
      { icon: '🥑', text: 'Vegan' },
    ],
    ingredients: '2/5 in fridge 🧺',
    rating: 4.9,
    liked: true,
  },
  {
    title: 'Spicy Noodles',
    image:
      '../../public/noodles-spicy-frying-pans-with-ingredients-black-cement-surface-top-view.jpg',
    meta: [
      { icon: '⏲', text: '15m' },
      { icon: '🍜', text: 'Asian' },
      { icon: '🌶', text: 'Spicy' },
    ],
    ingredients: '3/7 in fridge 🍜',
    rating: 4.7,
    liked: false,
  },
  {
    title: 'Berry Pancakes',
    image: '../../public/reciepes_discover/berry_pancakes.jpg',
    meta: [
      { icon: '⏲', text: '20m' },
      { icon: '🥞', text: 'Breakfast' },
      { icon: '🍓', text: 'Vegetarian' },
    ],
    ingredients: '4/6 in fridge 🥞',
    rating: 4.8,
    liked: true,
  },
])
const dailyPicks = ref([
  {
    title: 'Berry Smoothie',
    image: '../../public/reciepes_discover/berry_smoothie.jpg',
    meta: [
      { icon: '⏲', text: '5m' },
      { icon: '🌱', text: 'Healthy' },
      { icon: '🥑', text: 'Vegan' },
    ],
    ingredients: 'n/a',
    rating: 4.8,
    liked: false,
  },
  {
    title: 'Greek Salad',
    image: '../../public/reciepes_discover/greek_salad.jpg',
    meta: [
      { icon: '⏲', text: '8m' },
      { icon: '🍽', text: 'Mediterranean' },
      { icon: '🥗', text: 'Vegetarian' },
    ],
    ingredients: 'n/a',
    rating: 4.6,
    liked: false,
  },
  {
    title: 'Peanut Butter Toast',
    image: '../../public/reciepes_discover/peanutbutter_toast.jpg',
    meta: [
      { icon: '⏲', text: '6m' },
      { icon: '🍞', text: 'Western' },
      { icon: '🥑', text: 'Vegan' },
    ],
    ingredients: 'n/a',
    rating: 4.5,
    liked: false,
  },
])
const lookBack = ref([
  {
    title: 'Ramen Bowl',
    image: '../../public/reciepes_discover/ramen.jpg',
    meta: [
      { icon: '⏲', text: '30m' },
      { icon: '🍜', text: 'Japanese' },
      { icon: '🥩', text: 'Non-vegetarian' },
    ],
    ingredients: 'n/a',
    rating: 4.7,
    liked: true,
  },
  {
    title: 'Chicken Wrap',
    image: '../../public/reciepes_discover/chicken_wrap.jpg',
    meta: [
      { icon: '⏲', text: '15m' },
      { icon: '🌯', text: 'Fusion' },
      { icon: '🥩', text: 'Non-vegetarian' },
    ],
    ingredients: 'n/a',
    rating: 4.5,
    liked: false,
  },
  {
    title: 'Mango Sticky Rice',
    image: '../../public/reciepes_discover/mango_rice.jpg',
    meta: [
      { icon: '⏲', text: '20m' },
      { icon: '🥭', text: 'Thai' },
      { icon: '🥗', text: 'Vegetarian' },
    ],
    ingredients: 'n/a',
    rating: 4.9,
    liked: true,
  },
])

// Only use liked recipes
const recipes = computed(() =>
  [...curated.value, ...dailyPicks.value, ...lookBack.value].filter((r) => r.liked),
)

const idx = ref(0)
const currentRecipe = computed(() => recipes.value[idx.value])
const prevRecipeObj = computed(() =>
  recipes.value.length > 1
    ? recipes.value[(idx.value - 1 + recipes.value.length) % recipes.value.length]
    : null,
)
const nextRecipeObj = computed(() =>
  recipes.value.length > 1 ? recipes.value[(idx.value + 1) % recipes.value.length] : null,
)

function prevRecipe() {
  idx.value = (idx.value - 1 + recipes.value.length) % recipes.value.length
}
function nextRecipe() {
  idx.value = (idx.value + 1) % recipes.value.length
}
</script>

<style scoped>
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
</style>
