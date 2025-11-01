<template>
  <div class="app">
    <!-- HEADER -->
    <Header />

    <main class="profile-main">
      <!-- Page Header -->
      <div class="section-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h3>Account Settings</h3>
      </div>

      <!-- Profile Card Layout -->
      <div class="profile-layout">
        <!-- Left Side: Profile Picture Card -->
        <aside class="profile-card">
          <div class="profile-picture-wrapper">
            <img
              :src="profilePicPreview"
              alt="Profile Picture"
              class="profile-picture"
            />
            <label for="profile-pic-upload" class="upload-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              @change="handleProfilePicUpload"
            />
          </div>
          <h2 class="profile-name">{{ user.name }}</h2>
          <p class="profile-email">{{ user.email }}</p>
          <p class="profile-joined">Member since: {{ joinedDate }}</p>
        </aside>

        <!-- Right Side: Settings Card -->
        <section class="settings-card">
          <!-- Tab Navigation -->
          <nav class="settings-tabs">
            <button
              :class="['tab-btn', { active: activeTab === 'profile' }]"
              @click="activeTab = 'profile'"
            >
              Edit Profile
            </button>
            <button
              :class="['tab-btn', { active: activeTab === 'security' }]"
              @click="activeTab = 'security'"
            >
              Security
            </button>
          </nav>

          <!-- Tab Content: Edit Profile -->
          <div v-if="activeTab === 'profile'" class="form-section">
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  class="form-input"
                  v-model="name"
                />
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  v-model="email"
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>

          <!-- Tab Content: Security -->
          <div v-if="activeTab === 'security'" class="form-section">
            <form @submit.prevent="updatePassword">
              <h4 class="form-subtitle">Change Password</h4>
              <div class="form-group">
                <label for="current-password">Current Password</label>
                <input
                  id="current-password"
                  type="password"
                  class="form-input"
                  v-model="currentPassword"
                />
              </div>
              <div class="form-group">
                <label for="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  class="form-input"
                  v-model="newPassword"
                />
              </div>
              <div class="form-group">
                <label for="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  class="form-input"
                  v-model="confirmPassword"
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Update Password
              </button>
            </form>

            <!-- Delete Account Section -->
            <div class="danger-zone">
              <h4 class="form-subtitle">Delete Account</h4>
              <p>
                Once you delete your account, there is no going back. Please
                be certain.
              </p>
              <button class="btn btn-danger" @click="showDeleteConfirmation">
                Delete My Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- FOOTER -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from './common/Header.vue'
import Footer from './common/Footer.vue'

// --- Reactive Data ---

// Dummy user data (replace with your auth store)
const user = ref({
  name: 'Foodie',
  email: 'foodie@example.com',
  profilePic: '/profile-icon.png', // Default pic
  joined: '2024-01-15',
})

// Form fields
const name = ref(user.value.name)
const email = ref(user.value.email)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// UI state
const activeTab = ref('profile') // 'profile' or 'security'
const profilePicPreview = ref(user.value.profilePic)

// --- Computed Properties ---

const joinedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(user.value.joined).toLocaleString(undefined, options)
})

// --- Methods ---

function handleProfilePicUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Create a temporary URL to preview the image
    profilePicPreview.value = URL.createObjectURL(file)
    // In a real app, you would upload this file to your server
    console.log('File selected for upload:', file.name)
  }
}

function updateProfile() {
  // In a real app, send this to your backend
  console.log('Updating profile with:', {
    name: name.value,
    email: email.value,
  })
  // Update local user ref on success
  user.value.name = name.value
  user.value.email = email.value
  // Show a success message
  alert('Profile updated!') // Replace with a proper toast notification
}

function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('New passwords do not match!') // Replace with proper validation
    return
  }
  // In a real app, send this to your backend
  console.log('Updating password...')
  // Clear fields on success
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  alert('Password updated!') // Replace with a proper toast notification
}

function showDeleteConfirmation() {
  // In a real app, show a confirmation modal
  const confirmed = confirm(
    'Are you absolutely sure you want to delete your account? This cannot be undone.'
  )
  if (confirmed) {
    console.log('Deleting account...')
    // Call backend API to delete account
  }
}
</script>

<style scoped>
/* --- Inherit CSS Variables from UserHome.vue --- */
.app {
  --color-primary-green: #44704d;
  --color-dark-green: #3a5f42;
  --color-primary-brown: #a35d35;
  --color-light-tan: #f0e0c0;
  --color-bg: #fdfaf6;
  --color-text-primary: #333;
  --color-text-secondary: #555;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --border-radius-main: 18px;
  --shadow-main: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 6px 16px rgba(0, 0, 0, 0.12);
  --color-danger: #d9534f;
  --color-danger-dark: #c9302c;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
  background-color: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text-primary);
}

.profile-main {
  flex-grow: 1;
  width: 100%;
  max-width: 1000px; /* Constrained width */
  margin: 0 auto;
  padding: 24px;
}

/* --- Section Header (from UserHome) --- */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(68, 112, 77, 0.1);
}

.section-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-primary-green);
}

.section-header svg {
  width: 24px;
  height: 24px;
  stroke: var(--color-primary-brown);
}

/* --- Profile Layout --- */
.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr; /* Sidebar and main content */
  gap: 24px;
  align-items: start;
}

/* --- Profile Card (Left) --- */
.profile-card {
  background: #ffffff;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  padding: 32px 24px;
  text-align: center;
  border: 1px solid #f0f0f0;
  position: sticky; /* Sticks to top */
  top: 24px;
}

.profile-picture-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 16px auto;
}

.profile-picture {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-light-tan);
}

/* Hidden file input */
#profile-pic-upload {
  display: none;
}

/* Custom upload button */
.upload-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  background: var(--color-primary-green);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: var(--color-dark-green);
  transform: scale(1.1);
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.profile-email {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  word-wrap: break-word; /* Ensure long emails wrap */
}

.profile-joined {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

/* --- Settings Card (Right) --- */
.settings-card {
  background: #ffffff;
  border-radius: var(--border-radius-main);
  box-shadow: var(--shadow-main);
  border: 1px solid #f0f0f0;
  overflow: hidden; /* To contain tab border */
}

/* Tab Navigation */
.settings-tabs {
  display: flex;
  background-color: #fcfcfc;
  border-bottom: 1px solid #f0f0f0;
}

.tab-btn {
  flex: 1;
  padding: 18px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background-color: #f9f9f9;
  color: var(--color-primary-green);
}

.tab-btn.active {
  color: var(--color-primary-green);
  border-bottom-color: var(--color-primary-green);
}

/* Form Styling */
.form-section {
  padding: 32px;
}

.form-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary-green);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-light-tan);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-green);
  box-shadow: 0 0 0 3px rgba(68, 112, 77, 0.1);
  background-color: #fff;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-main);
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-primary {
  background: var(--color-primary-green);
  color: white;
}

.btn-primary:hover {
  background: var(--color-dark-green);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  background: var(--color-danger-dark);
}

/* Danger Zone */
.danger-zone {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px dashed #f0f0f0;
}

.danger-zone .form-subtitle {
  color: var(--color-danger);
  border-bottom-color: rgba(217, 83, 79, 0.2);
}

.danger-zone p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

/* --- Responsive Breakpoints --- */
@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr; /* Stack columns on tablet */
  }

  .profile-card {
    position: static; /* Un-stick the card */
  }
}

@media (max-width: 768px) {
  .profile-main {
    padding: 16px;
  }

  .form-section {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .settings-tabs {
    flex-direction: column;
  }

  .tab-btn {
    border-bottom: 1px solid #f0f0f0;
  }

  .tab-btn.active {
    border-bottom-color: var(--color-primary-green);
  }

  .form-section {
    padding: 20px;
  }
}
</style>
