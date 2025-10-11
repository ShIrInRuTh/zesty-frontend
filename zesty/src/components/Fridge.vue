<!-- TODO as of 10/10/25
 Make Remove Button Functional
 Revamp how we add things {ASK ADVICE + HELP}
 Make Adding Functional
 Hook up to Fridge DB BACKEND
 Work with img recogg api
 Lastly Link ALL to backend and db
 Pray it works -->

<template>
  <div class="app">
    <!-- HEADER -->
    <Header />
    <!-- FRIDGE-->
    <main class="fridge-main">
      <h2>Your Fridge</h2>

      <!-- Add + Remove buttons -->
      <div class="container-fluid">
        <div class="row justify-content-center" id="Fcontrols">
          <div class="col-md-6 text-center">
            <button class="btn btn-success m-2" @click="promptItemType">Add Item</button>
            <button class="btn btn-danger m-2">Remove Item</button>
          </div>
        </div>
      </div>

      <!-- HIDDEN FORMS--------------------------------------------------------------------------------------------------- -->
      <div class="container mt-3" id="addItemContainer">
        <div v-for="(item, index) in addedItems" :key="index" class="border p-3 mb-3 rounded">
          <!-- Manual: -->
          <div v-if="item.type === 'manual'">
            <strong>Manual:</strong>
            <div class="mb-2">
              <label>Item Name:</label>
              <input type="text" v-model="item.name" class="form-control d-inline-block w-auto" />
            </div>
            <div class="mb-2">
              <label>Qty:</label>
              <select v-model="item.qty" class="form-select d-inline-block w-auto">
                <option v-for="opt in qtyOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label>Category:</label>
              <input
                type="text"
                v-model="item.category"
                class="form-control d-inline-block w-auto"
              />
            </div>
            <div class="mb-2">
              <label>Expiry Date:</label>
              <input
                type="date"
                v-model="item.expiryDate"
                class="form-control d-inline-block w-auto"
              />
            </div>
            <div class="mb-2">
              <label>Date Added:</label>
              <input
                type="date"
                v-model="item.dateAdded"
                class="form-control d-inline-block w-auto"
                readonly
              />
            </div>
          </div>

          <!-- Automatic: -->
          <div v-else>
            <strong>Automatic:</strong>
            <div class="mb-2">
              <label>Image Input:</label>
              <input
                type="file"
                @change="onImageChange($event, index)"
                class="form-control d-inline-block w-auto"
              />
            </div>
            <div class="mb-2">
              <label>Qty:</label>
              <select v-model="item.qty" class="form-select d-inline-block w-auto">
                <option v-for="opt in qtyOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label>Category:</label>
              <input
                type="text"
                v-model="item.category"
                class="form-control d-inline-block w-auto"
              />
            </div>
            <div class="mb-2">
              <label>Expiry Date:</label>
              <input
                type="date"
                v-model="item.expiryDate"
                class="form-control d-inline-block w-auto"
              />
            </div>
            <div class="mb-2">
              <label>Date Added:</label>
              <input
                type="date"
                v-model="item.dateAdded"
                class="form-control d-inline-block w-auto"
                readonly
              />
            </div>
          </div>
        </div>
      </div>

      <!-- END of HIDDEN FORMS-------------------------------------------------------------------------------------------- -->

      <!-- CAT TABS -->
      <!-- None  <576px, sm  ≥576px, md  ≥768px, lg  ≥992px, xl  ≥1200px, xxl  ≥1400px -->
      <!-- CATEGORY TABS -->
      <div class="container mt-4">
        <ul class="nav nav-tabs nav-fill" role="tablist">
          <li class="nav-item" v-for="category in categories" :key="category">
            <button
              class="nav-link"
              :class="{ active: activeCategory === category }"
              @click="activeCategory = category"
              role="tab"
            >
              <!-- THIS IS THE TABS -->
              {{ category }}
              <span class="badge bg-light text-dark ms-1"> ({{ getCount(category) }}) </span>
            </button>
          </li>
        </ul>

        <!-- sort search -->
        <div class="d-flex justify-content-start mt-3 align-items-center flex-wrap gap-3">
          <!-- expiry sort -->
          <div class="d-flex align-items-center">
            <label for="sortOrder" class="me-2 fw-semibold">Sort by Expiry:</label>
            <select id="sortOrder" v-model="sortOrder" class="form-select w-auto">
              <option value="asc">Earliest</option>
              <option value="desc">Latest</option>
            </select>
          </div>

          <!-- searchbar -->
          <div class="d-flex align-items-center">
            <label for="searchQuery" class="me-2 fw-semibold">Search:</label>
            <input
              type="text"
              id="searchQuery"
              v-model="searchQuery"
              class="form-control w-auto"
              placeholder="Enter item name"
            />
          </div>
        </div>
      </div>

      <!-- bscards in con -->
      <div class="container my-5">
        <div class="row">
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            v-for="(item, index) in sortedFilteredItems"
            :key="index"
          >
            <div class="card h-100 shadow-sm" style="border-radius: 20px">
              <!-- IMAGE HANDLER incase no img -->
              <img
                :src="getImageSrc(item)"
                class="card-img-top"
                :alt="item.name"
                @error="(event) => (event.target.src = getImageSrc({ category: item.category }))"
                style="padding: 30px"
              />

              <div class="card-body text-center">
                <h5 class="card-title item-name">{{ item.name }}</h5>
                <p class="card-text item-qty">Qty: {{ item.qty }}</p>
                <p class="card-text item-date-added">Date Added: {{ item.dateAdded }}</p>
                <p
                  class="card-text item-expiry"
                  :style="{ color: getExpiryColor(item.expiryDate) }"
                >
                  Expiry: {{ item.expiryDate }}
                </p>
                <span class="badge bg-secondary text-capitalize">
                  {{ item.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script setup>
// ==============================================================  <Imports nonsense> [[[Please adjust for real data]]]
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import fridgeItems from '../../public/sample_data' // sample data path        [[[CHANGE TO ACTUAL BACKEND LATER]]]
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'

// ======================================================================================================   <Tabbing wif number count>
// tabs
const categories = ['All', 'Protein', 'Vegetable', 'Dairy', 'Fruit', 'Sauces', 'Dry-Ration']
const activeCategory = ref('All')

// get tab count
function getCount(category) {
  if (category === 'All') return fridgeItems.length
  return fridgeItems.filter((item) => item.category.toLowerCase() === category.toLowerCase()).length
}
// ======================================================================================================

// ======================================================================================================  <Sorting + Searching>

// sort order expiry date
const sortOrder = ref('asc')

// search by name
const searchQuery = ref('')

// filter items based on category and search
const filteredItems = computed(() => {
  return fridgeItems.filter((item) => {
    // category filter
    const matchesCategory =
      activeCategory.value === 'All' ||
      item.category.toLowerCase() === activeCategory.value.toLowerCase()

    // search filter (case-insensitive)
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesCategory && matchesSearch
  })
})

// sort filtered items by expiry date
const sortedFilteredItems = computed(() => {
  return [...filteredItems.value].sort((a, b) => {
    const dateA = new Date(a.expiryDate)
    const dateB = new Date(b.expiryDate)

    if (sortOrder.value === 'asc') {
      return dateA - dateB
    } else {
      return dateB - dateA
    }
  })
})
// ======================================================================================================

// ======================================================================================================   <Expiry Date Coloring WOWSER>
function getExpiryColor(expiryDate) {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - now
  const diffDays = diffTime / (1000 * 60 * 60 * 24) // convert ms to days

  if (diffDays > 30) {
    return 'green'
  } else if (diffDays >= 14) {
    return 'orange'
  } else {
    return 'red'
  }
}
// ======================================================================================================

// ======================================================================================================   <image for category>
// ======================================================================================================   <Image fallback based on category>
function getImageSrc(item) {
  // If the item has a valid img path, use it
  if (item.img && item.img.trim() !== '') {
    return item.img
  }

  // Otherwise, return a category-based placeholder
  const category = (item.category || '').toLowerCase()
  switch (category) {
    case 'protein':
      return '/Cat_Icons/Protein.png'
    case 'dairy':
      return '/Cat_Icons/Dairy.png'
    case 'dry-ration':
    case 'dry':
      return '/Cat_Icons/Dry.png'
    case 'fruit':
      return '/Cat_Icons/Fruit.png'
    case 'sauces':
    case 'sauce':
      return '/Cat_Icons/Sauces.png'
    case 'vegetable':
      return '/Cat_Icons/Vegetable.png'
    default:
      return '/Cat_Icons/Dry.png' // generic fallback
  }
}

// ======================================================================================================

// ======================================================================================================  <FORM>

// Track added items (manual or automatic)
const addedItems = ref([])

// Qty dropdown
const qtyOptions = ['pcs', 'ml', 'l', 'kg', 'g', 'cup', 'can']

//Manual or Automatic
function promptItemType() {
  const type = window.prompt("Enter item type: 'manual' or 'automatic'").toLocaleLowerCase()
  if (type === 'manual' || type === 'automatic') {
    addItem(type)
  } else if (type !== null) {
    alert("Please enter 'manual' or 'automatic'")
  }
}

// Add item function
function addItem(type) {
  addedItems.value.push({
    type, // 'manual' or 'automatic'
    name: '',
    qty: 'pcs',
    category: '',
    expiryDate: '',
    dateAdded: new Date().toISOString().split('T')[0], // auto today
    img: null,
  })
}

// img
function onImageChange(event, index) {
  const file = event.target.files[0]
  if (file) {
    addedItems.value[index].img = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
/* MAIN FRIDGE  */
main.fridge-main {
  flex-grow: 1;
  padding: 30px 16px;
  text-align: center;
}

main.fridge-main h2 {
  font-size: 36px;
  font-weight: bold;
}

main.fridge-main p {
  /* font-size: 18px; */
  max-width: 600px;
  margin: 0 auto;
}

/* CARD  */
.item-name {
  font-weight: 600;
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.item-qty {
  color: #16a085;
  font-weight: 500;
  font-size: 16px;
}

.item-date-added {
  color: #2980b9;
  font-size: 90%;
}

.item-expiry {
  color: #c0392b;
  font-size: 90%;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  color: black;
  background-color: white;
  margin: 0;
}
</style>
