<!-- TODO as of 2/11/25
 Add breakpoints for responsiveness
 fix card sizes for responsiveness
 fix unknown category 
 linnkage
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
            <button class="btn btn-success m-2" @click="addItemRow">Add Item</button>
            <button class="btn btn-danger" @click="openRemoveModal()">Remove</button>

          </div>
        </div>
      </div>

      <!-- HIDDEN FORMS--------------------------------------------------------------------------------------------------- -->
      <div class="container mt-3" id="addItemContainer" v-if="addedItems.length > 0">
        <div v-for="(item, index) in addedItems" :key="index"
          class="row border p-3 mb-3 rounded justify-content-center align-items-start text-center">
          <!-- RADIO selector FIRST -->
          <div class="col-12 mb-3 d-flex justify-content-center gap-4">
            <label>
              <input type="radio" v-model="item.selected" value="manual" /> Manual
            </label>
            <label>
              <input type="radio" v-model="item.selected" value="automatic" /> Automatic
            </label>
          </div>


          <!-- Left: Manual -->
          <div class="col-md-5" v-show="item.selected === 'manual'">
            <strong>Manual:</strong>

            <div class="mb-2">
              <label>Item Name:</label>
              <input type="text" v-model="item.name" class="form-control" />
            </div>

            <div class="mb-2">
              <label>Qty:</label>
              <div class="d-flex align-items-center">
                <!-- Numeric Value (left) -->
                <input type="number" v-model.number="item.qtyValue" class="form-control me-2" min="0"
                  placeholder="Value" style="max-width: 50%;" />

                <!-- Quantity Type (right) -->
                <select v-model="item.qty" class="form-select" style="max-width: 50%;">
                  <option v-for="opt in qtyOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>

            <div class="mb-2">
              <label>Category:</label>
              <select v-model="item.category" class="form-select">
                <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="mb-2">
              <label>Expiry Date:</label>
              <input type="date" v-model="item.expiryDate" class="form-control" />
            </div>

            <div class="mb-2">
              <label>Date Added:</label>
              <input type="date" v-model="item.dateAdded" class="form-control" readonly />
            </div>
          </div>



          <!-- Right: Automatic -->
          <div class="col-md-5" v-show="item.selected === 'automatic'">
            <strong>Automatic:</strong>
            <div class="mb-2">
              <label>Image Input:</label>
              <input type="file" @change="onImageChange($event, index)" class="form-control" />
            </div>
            <div class="d-flex align-items-center">
            <!-- Numeric Value -->
            <input type="number" v-model.number="item.qtyValue" class="form-control me-2" min="0" placeholder="Value" style="max-width: 50%;" />

            <!-- Quantity Type -->
            <select v-model="item.qty" class="form-select" style="max-width: 50%;">
              <option v-for="opt in qtyOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select></div>


            <div class="mb-2">
              <label>Expiry Date:</label>
              <input type="date" v-model="item.expiryDate" class="form-control" />
            </div>
            <div class="mb-2">
              <label>Date Added:</label>
              <input type="date" v-model="item.dateAdded" class="form-control" readonly />
            </div>
          </div>

          <!-- SUBMIT BUTTON -->
          <div class="col-12 mt-3">
            <button class="btn btn-primary" @click="submitItem(index)">Submit</button>
          </div>
        </div>
      </div>
      <!-- END of HIDDEN FORMS-------------------------------------------------------------------------------------------- -->

      <!-- CAT TABS -->
      <div class="container mt-4">
        <ul class="nav nav-tabs nav-fill" role="tablist"
          style="background-color: #dbc09c; border-radius: 18px; padding: 0.5rem;">
          <li class="nav-item" v-for="category in categories" :key="category"
            style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: bold;">

            <button class="nav-link"
            :class="{ active: activeCategory === category }"
            role="tab"
            @click="switchCategory(category)">
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
            <input type="text" id="searchQuery" v-model="searchQuery" class="form-control w-auto"
              placeholder="Enter item name" />
          </div>
        </div>
      </div>

      <!-- bscards in con -->
      <div class="container my-5" v-if="fridgeItems.length > 0">
        <div class="row">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(item, index) in filteredAndSortedItems" :key="index">
            <div class="kitchen-card" style="border-radius: 20px">
              <!-- REMOVE BUTTON -->
              <button v-if="removeMode" class="btn btn-danger position-absolute"
                style="top: 5px; right: 5px; border-radius: 50%; width: 30px; height: 30px; padding: 0;"
                @click="confirmRemove(item, index)">
                X
              </button>

              <!-- Remove Modal -->
              <div class="modal fade" id="removeModal" tabindex="-1" aria-labelledby="removeModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="removeModalLabel">Remove Ingredients</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <!-- Search bar inside remove modal -->
                      <div class="mb-3 text-center">
                        <input v-model="removeSearchQuery" type="text" class="form-control w-50 mx-auto"
                          placeholder="Search items..." />
                      </div>

                      <div class="row row-cols-1 row-cols-md-3 g-3">
                        <div v-for="(item, index) in filteredFridgeItemsForRemove" :key="index" class="col">
                          <div class="card h-100 text-center">

                            <img :src="getImageSrc(item)" class="card-img-top" :alt="item.name"
                              @error="(event) => (event.target.src = getImageSrc({ category: item.category, item_name: item.name }))"
                              style="height:120px; object-fit:contain;" />
                            <div class="card-body">
                              <h6 class="card-title">{{ item.name }}</h6>
                              <p class="card-text item-qty">Qty: {{ item.qty }}{{ item.qty_type }}</p>
                              <p class="card-text small mb-1">{{ item.category }}</p>
                              <p class="card-text item-expiry" :style="{ color: getExpiryColor(item.expiryDate) }">
                              <p v-if="new Date(item.expiryDate) < new Date()" class="text-danger fw-bold">⚠️ Expired</p>
                                Expiry: {{ item.expiryDate }}
                              </p>
                              <button class="btn btn-outline-danger btn-sm" @click="askRemove(item)">❌ Remove</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quantity & Confirm Remove Modal -->
              <div class="modal fade" id="confirmRemoveModal" tabindex="-1" aria-labelledby="confirmRemoveModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="confirmRemoveModalLabel">Remove Quantity</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                      <h6>Enter quantity to remove from <strong>{{ itemToRemove?.name }}</strong>:</h6>
                      <input type="text" v-model="removeQty" class="form-control w-50 mx-auto" placeholder="Quantity">
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="btn btn-danger" @click="confirmRemoveQty">Confirm</button>
                    </div>
                  </div>
                </div>
              </div>


              <!-- IMAGE HANDLER incase no img -->
              <img :src="getImageSrc(item)" class="card-img-top" :alt="item.name"
                @error="(event) => (event.target.src = getImageSrc({ category: item.category, item_name: item.name }))"
                style="padding: 30px" />
              <div class="card-body text-center">
                <h5 class="card-title item-name">{{ item.name }}</h5>
                <p class="kc-meta">Qty: {{ item.qty }}{{ item.qty_type }}</p>
                <p class="kc-meta" style="color:#2980b9">Date Added: {{ item.dateAdded }}</p>
                <p class="kc-meta" :style="{ color: getExpiryColor(item.expiryDate) }">
                <p v-if="new Date(item.expiryDate) < new Date()" class="text-danger fw-bold">⚠️ Expired</p>

                  Expiry: {{ item.expiryDate }}
                </p>
                <span class="badge bg-secondary text-capitalize">{{ item.category }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Hidden Message modals -->
      <div class="modal fade" id="messageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Notice</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto Img Confirmation Modal -->
      <div v-if="showAiModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content p-4">
            <h5>AI Detected Ingredient</h5>

            <div class="mb-2">
              <label>Name:</label>
              <input type="text" v-model="aiResult.name" class="form-control" />
            </div>

            <div class="mb-2">
              <label>Category:</label>
              <select v-model="aiResult.category" class="form-select">
                <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-success" @click="confirmAiResult">Confirm</button>
              <button class="btn btn-secondary" @click="showAiModal = false">Cancel</button>
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
import { ref, computed, onMounted } from 'vue'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'
import axios from 'axios'

// AUTO FORM helper
const itemName = ref("")
const itemCategory = ref("")

const confirmAiResult = () => {
  if (!aiResult.value || currentAiIndex.value === null) return;

  // Update existing row instead of pushing a new one
  const index = currentAiIndex.value;
  addedItems.value[index].name = aiResult.value.name;
  addedItems.value[index].category = aiResult.value.category;
  addedItems.value[index].img = aiResult.value.img || '';

  showAiModal.value = false;
  currentAiIndex.value = null; // reset
};


// ======================================================================================================   <Tabbing wif number count>
const categories = ['All', 'Protein', 'Vegetable', 'Dairy', 'Fruit', 'Sauces', 'Dry-Ration']
const activeCategory = ref('All')

// ===================================== Fridge Items =====================================
const fridgeItems = ref([])
const categoryNum = ref([])

// Supabase client setup
const SUPABASE_URL = "https://lckghapuxijhsfydfzmy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja2doYXB1eGlqaHNmeWRmem15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTY0MzAsImV4cCI6MjA3NjM3MjQzMH0.yjW7FEGKDuhpPI-AMuOcj-1UJRP7AbMNvLyAbE1Q5RA";

// Loading + simple race-control
const isLoading = ref(false)
let currentFetchToken = 0

// Centralised loader: calls backend, maps data, sets state
async function loadFridgeItems(cat = "") {
  const fridgeId = sessionStorage.getItem("fridgeId")
  if (!fridgeId) {
    console.warn("No fridge ID found in sessionStorage")
    return
  }

  const token = ++currentFetchToken
  isLoading.value = true

  try {
    const res = await axios.post(`http://localhost:8000/api/fridge/${fridgeId}`, { cat })
    const result = res.data.message || []
    const cats = res.data.cat || []
    console.log(cats, res.data)

    // If another fetch started after this one, discard this result
    if (token !== currentFetchToken) {
      // a newer request is in flight — ignore this result
      return
    }

    // Map Supabase columns to your local item object
    fridgeItems.value = result.map(item => ({
      id: item.item_id,
      img: item.img_url || '',
      name: item.item_name,
      qty: item.qty,
      qty_type: item.qty_type,
      dateAdded: item.date_added ? new Date(item.date_added).toISOString().split('T')[0] : '',
      expiryDate: item.expiry_date ? new Date(item.expiry_date).toISOString().split('T')[0] : '',
      category: item.category || ''
    }))

    categoryNum.value=cats
  } catch (err) {
    console.error("Error loading fridge items:", err)
  } finally {
    // Only clear loading if this is the latest fetch
    if (token === currentFetchToken) isLoading.value = false
  }
}



onMounted(() => {
  loadFridgeItems('')
  
})

function switchCategory(category) {
  // Optionally reset search when switching
  // searchQuery.value = ''
  activeCategory.value = category
  // call loader (backend will filter by category if supported)
  loadFridgeItems(category === 'All' ? '' : category)
}





// get tab count
function getCount(category) {
  if (category === 'All') return Object.values(categoryNum.value).reduce((sum, n) => sum + Number(n || 0), 0)
  console.log(categoryNum.value)
  return categoryNum.value[category.toLowerCase()]
}

// ======================================================================================================
// WTF am i doing , imma crash out this shit is not it , i wanna dieeeeeee
const currentAiIndex = ref(null)




// ======================================================================================================  <Sorting + Searching>

// sort order expiry date
const sortOrder = ref('asc')

// search by name
const searchQuery = ref('')

// ✅ Filtered + sorted fridge items for display
const filteredAndSortedItems = computed(() => {
  let items = [...fridgeItems.value]

  // 🔍 Filter by search query
  if (searchQuery.value.trim() !== "") {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(item => item.name.toLowerCase().includes(q))
  }

  // 🧩 Filter by active category (if not 'All')
  if (activeCategory.value && activeCategory.value !== "All") {
    items = items.filter(
      item => item.category.toLowerCase() === activeCategory.value.toLowerCase()
    )
  }

  // 📅 Sort by expiry date (ascending or descending)
  items.sort((a, b) => {
    const dateA = new Date(a.expiryDate)
    const dateB = new Date(b.expiryDate)
    return sortOrder.value === "asc" ? dateA - dateB : dateB - dateA
  })

  return items
})

// ======================================================================================================

// ======================================================================================================   <Expiry Date Coloring WOWSER>
function getExpiryColor(expiryDate) {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry - now
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return 'gray' // expired items
  if (diffDays <= 7) return 'red'
  if (diffDays <= 30) return 'orange'
  return 'green'
}
// ======================================================================================================

// ======================================================================================================   <Image fallback based on category>
function getImageSrc(item) {
  if (item.img && item.img.trim() !== '') return item.img
  const category = (item.category || '').toLowerCase()
  switch (category) {
    case 'protein': return '/Cat_Icons/Protein.png'
    case 'dairy': return '/Cat_Icons/Dairy.png'
    case 'dry-ration':
    case 'dry': return '/Cat_Icons/Dry.png'
    case 'fruit': return '/Cat_Icons/Fruit.png'
    case 'sauces':
    case 'sauce': return '/Cat_Icons/Sauces.png'
    case 'vegetable': return '/Cat_Icons/Vegetable.png'
    default: return '../public/logo.png'
  }
}

// ======================================================================================================  <FORM>
const addedItems = ref([])
const qtyOptions = ['pcs', 'ml', 'l', 'kg', 'g', 'cup', 'can']

async function onImageChange(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  addedItems.value[index].img = URL.createObjectURL(file);
  const cloudUrl = await uploadToCloudinary(file);
  if (cloudUrl) {
    addedItems.value[index].img = cloudUrl;
    currentAiIndex.value = index; // <-- track which row triggered AI
    await recognizeIngredient(cloudUrl);
  }
}


function addItemRow() {
  if (addedItems.value.length === 0) {
    addedItems.value.push({
      selected: 'manual',
      name: '',
      qty: 'pcs',
      category: '',
      expiryDate: '',
      dateAdded: new Date().toISOString().split('T')[0],
      img: null,
    })
  }
}

// ======================================================================================================       <REMOVE MODE Toggleing>
function openRemoveModal() {
  const modal = new bootstrap.Modal(document.getElementById('removeModal'))
  modal.show()
}

const removeSearchQuery = ref('')
const filteredFridgeItemsForRemove = computed(() => {
  return fridgeItems.value.filter((item) => {
    const q = (removeSearchQuery.value || '').toLowerCase()
    const expiryStr = item.expiryDate ? item.expiryDate.toString().toLowerCase() : ''
    return (
      (item.name || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      expiryStr.includes(q)
    )
  })
})


const itemToRemove = ref(null)
const removeQty = ref('')

// Show confirm modal
function askRemove(item) {
  itemToRemove.value = item
  removeQty.value = ''
  const modal = new bootstrap.Modal(document.getElementById('confirmRemoveModal'))
  modal.show()
}

// Confirm removal
async function confirmRemoveQty() {
  // 1️⃣ Basic checks
  if (!removeQty.value) {
    showModalMessage('Please enter a quantity to remove.')
    return
  }
  if (!itemToRemove.value || !itemToRemove.value.id) {
    showModalMessage('No item selected or missing item ID.')
    return
  }

  const fridgeId = sessionStorage.getItem("fridgeId")
  if (!fridgeId) {
    showModalMessage('No fridge ID found in session.')
    return
  }

  try {
    // 2️⃣ Parse quantity values
    const currentQtyNum = parseFloat(itemToRemove.value.qty)
    const removeQtyNum = parseFloat(removeQty.value)
    const unit = itemToRemove.value.qty_type || ''

    // 3️⃣ Validate quantity inputs
    if (isNaN(currentQtyNum) || isNaN(removeQtyNum)) {
      showModalMessage('Invalid quantity input.')
      return
    }
    if (removeQtyNum <= 0) {
      showModalMessage('Invalid amount — must be positive (>0).')
      return
    }
    if (removeQtyNum > currentQtyNum) {
      showModalMessage(`Try Again — you only have ${currentQtyNum} ${unit} available.`)
      return
    }

    const newQtyNum = currentQtyNum - removeQtyNum

    // 4️⃣ If new qty ≤ 0, delete the item
    if (newQtyNum <= 0) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/fridge_items?item_id=eq.${itemToRemove.value.id}`, {
        method: 'DELETE',
        headers: {
          apiKey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) throw new Error('Failed to delete item.')

      // Remove from Vue state
      fridgeItems.value = fridgeItems.value.filter(i => i.id !== itemToRemove.value.id)
      showModalMessage(`${itemToRemove.value.name} fully removed from fridge!`)
    }
    // 5️⃣ Otherwise, update the item quantity
    else {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/fridge_items?item_id=eq.${itemToRemove.value.id}`, {
        method: 'PATCH',
        headers: {
          apiKey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qty: newQtyNum })
      })
      if (!res.ok) throw new Error('Failed to update item.')

      // Update local state
      const index = fridgeItems.value.findIndex(i => i.id === itemToRemove.value.id)
      if (index !== -1) fridgeItems.value[index].qty = newQtyNum

      showModalMessage(`${removeQty.value} ${unit} removed from ${itemToRemove.value.name}`)
    }

  } catch (err) {
    console.error(err)
    showModalMessage('Error removing quantity: ' + err.message)
  }

  // 6️⃣ Close the confirm modal programmatically
  const modalEl = document.getElementById('confirmRemoveModal')
  const modalInstance = bootstrap.Modal.getInstance(modalEl)
  if (modalInstance) modalInstance.hide()
}


// Utility: show modal with message instead of alert
function showModalMessage(message) {
  const modalEl = document.getElementById('messageModal');
  const modalBody = modalEl.querySelector('.modal-body');
  modalBody.textContent = message;

  // Create a new Bootstrap modal instance if none exists
  let modal = bootstrap.Modal.getInstance(modalEl);
  if (!modal) modal = new bootstrap.Modal(modalEl);

  // Show the modal
  modal.show();

  // Listen for modal hidden event to remove any leftover backdrop
  modalEl.addEventListener('hidden.bs.modal', () => {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    // Optional: remove modal-open class from body
    document.body.classList.remove('modal-open');
  }, { once: true }); // ensures listener runs only once
}



// ======================================================================================================       



// ======================================================================================================       <ITEM INSERTION>

///////////////FORM type Selector
async function submitItem(index) {
  const item = addedItems.value[index];
  if (!item) return;

  // Prepare full form data
  const formData = {
    name: item.name,
    qtyValue: item.qtyValue,
    qtyType: item.qty,
    category: item.category.toLowerCase(),
    expiryDate: item.expiryDate,
    dateAdded: item.dateAdded,
    img: item.img,
  };

  try {
    if (item.selected === 'manual') {
      // Call manual handler
      await manualFunc(formData);
      showModalMessage(`${item.name} submitted manually!`);
    } else if (item.selected === 'automatic') {
      // Call automatic handler
      await autoFunc(formData);
      showModalMessage(`${item.name} submitted automatically!`);
    }

    // ✅ Remove the form for this item after submission
    addedItems.value.splice(index, 1);

  } catch (err) {
    console.error(err);
    showModalMessage('Error submitting: ' + err.message);
  }
}


// Manual submission handler
// Manual submission handler - adds item to Supabase
async function manualFunc(formData) {
  const fridgeId = sessionStorage.getItem("fridgeId");
  if (!fridgeId) return showModalMessage("No fridge ID found in session.");

  // Basic validation
  if (
    !formData.name ||
    !formData.qtyValue ||
    formData.qtyValue <= 0 ||
    !formData.qtyType ||
    !formData.category ||
    !formData.expiryDate
  ) {
    return showModalMessage("Please fill in all fields correctly.");
  }

  try {
    const newItem = {
      item_name: formData.name.trim(),
      qty: parseFloat(formData.qtyValue),
      qty_type: formData.qtyType,
      category: formData.category,
      expiry_date: formData.expiryDate,
      date_added: formData.dateAdded || new Date().toISOString(),
      img_url: formData.img || '/images/missing/default.png',
      fridge_id: fridgeId
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/fridge_items`, {
      method: 'POST',
      headers: {
        apiKey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation' // optional, gets inserted record back
      },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) throw new Error('Failed to add item.');

    showModalMessage(`${formData.name} added successfully!`);

    // Refresh local fridge items
    await fetchFridgeItems();

  } catch (err) {
    console.error(err);
    showModalMessage('Error adding item: ' + err.message);
  }
}
// ======================================================================================================   
async function autoFunc(formData) {
  let cleanUrl = formData.img.replace(/\.jpg$/, '');
  const fridgeId = sessionStorage.getItem("fridgeId");
  if (!fridgeId) {
    return showModalMessage("No fridge ID found in session.");
  }

  // Validate required fields
  if (
    !formData.name ||
    !formData.qtyValue ||
    formData.qtyValue <= 0 ||
    !formData.qtyType ||
    !formData.category ||
    !formData.expiryDate
  ) {
    return showModalMessage("Please fill in all fields correctly.");
  }

  try {
    const newItem = {
      item_name: formData.name.trim(),
      qty: parseFloat(formData.qtyValue),
      qty_type: formData.qtyType || 'pcs', // default if missing
      category: formData.category,
      expiry_date: formData.expiryDate,
      date_added: formData.dateAdded || new Date().toISOString(),
      img_url: cleanUrl || '/images/missing/default.png',
      fridge_id: fridgeId
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/fridge_items`, {
      method: 'POST',
      headers: {
        apiKey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(newItem)
    });

    if (!res.ok) throw new Error('Failed to add automatic item.');

    // Refresh fridge items in your app
    await fetchFridgeItems();

  } catch (err) {
    console.error(err);
    showModalMessage('Error adding automatic item: ' + err.message);
  }
}





// ======================================================================================================       <Img Auto Insertion>
const aiResult = ref(null)
const showAiModal = ref(false)
const isRecognizing = ref(false)

// Cloudinary info
const CLOUD_NAME = "dld2rfhyu";
const UPLOAD_PRESET = "fridge_preset";

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    console.log("Cloudinary URL:", data.secure_url);
    return data.secure_url;

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
}

const handleImageUpload = async (file) => {
  try {
    const imgUrl = await uploadToCloudinary(file)
    console.log("Cloudinary URL:", imgUrl)
    await recognizeIngredient(imgUrl)
  } catch (error) {
    console.error("Error uploading or recognizing:", error)
  }
}


const recognizeIngredient = async (imgUrl) => {
  try {
    isRecognizing.value = true;

    const response = await axios.post("http://localhost:8000/api/imgreco", { img: imgUrl });
    const aiData = response.data.item;

    if (!aiData?.name) throw new Error("AI backend did not return an ingredient name.");

    aiResult.value = {
      name: aiData.name,
      category: aiData.category && categories.includes(aiData.category) ? aiData.category : categories[1], // default to first real category
      img: imgUrl
    };

    console.log(aiResult)

    showAiModal.value = true;

  } catch (error) {
    console.error("AI recognition failed:", error.response?.data?.error || error.message);
    alert(`AI recognition failed: ${error.response?.data?.error || "Check console for details."}`);
  } finally {
    isRecognizing.value = false;
  }
};










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

.active {
  background-color: #44704d !important;
  border: none !important;
  color: white !important;
  border-radius: 18px;
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

.nav-link:hover {
  border-radius: 18px !important;
  background: #D5BD99;
  border: none;
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

.kc-meta {
  background: #f4e3d4;
  border-radius: 18px 16px 20px 15px/20px 22px 15px 18px;
  font-size: 12px;
  padding: 9px 19px;
  color: #054e1c;
  font-weight: 600;
  box-shadow: 0 1.5px 6px rgba(180, 120, 60, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin-bottom: 10px !important;
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
  width: 250px;
}
</style>
