<template>
  <div class="recipe-page">
    <div class="recipe-header">
      <h1 class="recipe-name">{{ recipe?.title }}</h1>
      <img :src="recipe?.image_url" alt="Recipe photo" class="recipe-image" />
    </div>

    <div class="main-container">
      <!-- Chat Panel -->
      <div class="panel chat-panel">
        <div class="panel-header">
          <h2 class="panel-title">Cooking Assistant 👩‍🍳</h2>

          <div class="voice-controls">
            <button
              class="voice-btn start-btn"
              @click="startRecipeSession"
              :disabled="isCooking || !recipe"
            >
              <span class="btn-icon">🍳</span>
              Start Recipe
            </button>

            <button
              class="voice-btn record-btn"
              @click="toggleRecording"
              :class="{ active: isRecording, recording: isRecording }"
              :disabled="isSpeaking || isListening"
              title="Record and Transcribe"
            >
              <span class="btn-icon">{{ isRecording ? '⏹️' : '🎙️' }}</span>
              {{ isRecording ? `Recording (${recordedTime}s)` : 'Record & Transcribe' }}
            </button>
          </div>
        </div>

        <!-- Network Status -->
        <div v-if="!isOnline" class="network-status error">
          ⚠️ You're offline. Some features may not work.
        </div>

        <!-- Speech Status -->
        <div v-if="speechStatus" class="speech-status" :class="speechStatus.type">
          {{ speechStatus.message }}
        </div>

        <!-- Recording Visualizer -->
        <div v-if="isRecording" class="recording-visualizer">
          <div
            v-for="n in 8"
            :key="n"
            class="visualizer-bar"
            :style="{ height: `${getVisualizerHeight(n)}px` }"
          ></div>
          <div class="recording-timer">{{ recordedTime }}s</div>
        </div>

        <!-- Recording Playback & Transcription -->
        <div v-if="audioUrl && !isTranscribing" class="recording-playback">
          <div class="playback-controls">
            <button class="delete-btn" @click="deleteRecording">
              <span class="btn-icon">🗑️</span>
              Delete
            </button>
          </div>

          <div v-if="transcriptionResult" class="transcription-result">
            <h4>Transcription:</h4>
            <div class="transcribed-text">{{ transcriptionResult }}</div>
            <div class="transcription-actions">
              <button class="action-btn use-text-btn" @click="useTranscription">
                Use This Text
              </button>
              <button class="action-btn retry-btn" @click="retryTranscription">Try Again</button>
            </div>
          </div>
        </div>

        <!-- Transcribing Status -->
        <div v-if="isTranscribing" class="transcribing-status">
          <div class="loading-spinner"></div>
          Transcribing your recording to text...
          <div class="transcription-progress">{{ transcriptionProgress }}</div>
        </div>

        <!-- Current Step Indicator -->
        <!-- Current Step Indicator -->
        <div class="current-step-indicator">
          <div class="step-indicator-header">
            <h3>
              Current Step:
              {{ totalSteps ? currentStepIndex + 1 : 0 }}
              of
              {{ totalSteps }}
            </h3>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="message-content">
              {{ message.text }}
              <div class="message-actions">
                <button
                  class="speak-message-btn"
                  @click="speakMessage(message.text)"
                  :disabled="isSpeaking"
                  title="Read this message aloud"
                >
                  {{ isSpeaking && currentSpeechText === message.text ? '⏹️' : '🔊' }}
                </button>

                <button
                  v-if="message.audioUrl"
                  class="play-message-audio-btn"
                  @click="playMessageAudio(message)"
                  :disabled="isPlayingMessageAudio"
                  title="Play original recording"
                >
                  {{
                    isPlayingMessageAudio && currentPlayingAudio === message.audioUrl ? '⏹️' : '🎵'
                  }}
                </button>
              </div>
            </div>
            <div v-if="message.transcriptionSource" class="message-source">
              {{ message.transcriptionSource }}
            </div>
          </div>
        </div>

        <!-- Step Navigation Buttons -->
        <div v-if="currentInstruction || isRecipeComplete" class="step-navigation">
          <div class="step-buttons">
            <button v-if="!isRecipeComplete" class="action-btn continue-btn" @click="nextStep">
              <span class="btn-icon">✅</span>
              {{
                currentStepIndex === recipe?.instructions.length - 1
                  ? 'Finish Recipe'
                  : 'Continue to Next Step'
              }}
            </button>

            <button
              v-if="!isRecipeComplete"
              class="action-btn repeat-btn"
              @click="repeatInstruction"
            >
              <span class="btn-icon">🔁</span>
              Repeat Instruction
            </button>

            <button
              v-if="isRecipeComplete"
              class="action-btn complete-btn"
              @click="completeCooking"
            >
              <span class="btn-icon">🎉</span>
              Complete Cooking
            </button>
          </div>

          <div class="step-progress-mini">
            {{
              isRecipeComplete
                ? 'Recipe Complete!'
                : `Step ${currentStepIndex + 1} of ${recipe?.instructions.length}`
            }}
          </div>
        </div>

        <!-- Input Row -->
        <div class="chat-input-container">
          <input
            type="text"
            class="chat-input"
            v-model="newMessage"
            placeholder="Ask a question about the current step..."
            @keyup.enter="sendMessage"
            :disabled="!isOnline"
          />
          <button class="send-btn" @click="sendMessage" :disabled="!isOnline">
            <span class="send-icon">📤</span>
          </button>
          <button
            class="mic-btn"
            @click="toggleRecording"
            :class="{ active: isRecording, recording: isRecording }"
            :disabled="isSpeaking || isListening"
            title="Record Voice Note"
          >
            <span class="mic-icon">{{ isRecording ? '⏹️' : '🎙️' }}</span>
          </button>
        </div>

        <!-- Progress Panel -->
        <div class="panel progress-panel">
          <div class="panel-header">
            <h2 class="panel-title">Progress 📊</h2>
          </div>
          <div class="progress-section">
            <div class="progress-bar-outer">
              <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">{{ progress }}% Complete</div>
            <div class="step-progress">
              Step {{ currentStepIndex + 1 }} of {{ recipe?.instructions.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions Panel -->
      <div class="panel instructions-panel">
        <div class="panel-header">
          <h2 class="panel-title">Instructions 📝</h2>
          <div class="steps-counter">
            Step {{ currentStepIndex + 1 }} of {{ recipe?.instructions.length }}
          </div>
        </div>
        <div class="instructions-list">
          <div
            v-for="(instruction, index) in recipe?.instructions"
            :key="index"
            :class="[
              'instruction-item',
              {
                completed: index < currentStepIndex,
                current: index === currentStepIndex,
                upcoming: index > currentStepIndex,
              },
            ]"
          >
            <div class="instruction-number">{{ index + 1 }}</div>
            <div class="instruction-text">{{ instruction }}</div>
          </div>
        </div>
      </div>

      <!-- Ingredients Panel -->
      <div class="panel ingredients-panel">
        <div class="panel-header">
          <h2 class="panel-title">Ingredients 🥑</h2>
        </div>
        <ul class="ingredients-list">
          <li
            v-for="(ingredient, idx) in recipe?.ingredients_list"
            :key="idx"
            class="ingredient-item"
          >
            <span class="ingredient-dot"></span>
            <span class="ingredient-name">{{ ingredient.name }}</span>
            <span class="ingredient-portion">[{{ ingredient.portion }}]</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="bottom-actions">
      <button class="action-btn like-btn" :class="{ liked: isLiked }" @click="toggleLike">
        <span class="btn-icon">❤️</span>
        {{ isLiked ? 'Loved!' : 'Like Recipe' }}
      </button>

      <button
        class="action-btn previous-btn"
        @click="previousStep"
        :disabled="currentStepIndex === 0"
      >
        <span class="btn-icon">⬅️</span>
        Previous Step
      </button>

      <button class="action-btn continue-btn" @click="nextStep" :disabled="!totalSteps">
        <span class="btn-icon">✅</span>
        {{ currentStepIndex === totalSteps - 1 ? 'Finish Recipe' : 'Continue to Next Step' }}
      </button>

      <button class="action-btn repeat-btn" @click="repeatInstruction" :disabled="!totalSteps">
        <span class="btn-icon">🔁</span>
        Repeat Instruction
      </button>

      <button class="action-btn stop-btn" @click="stopCooking">
        <span class="btn-icon">⏹️</span>
        Stop Cooking
      </button>

      <div class="step-counter-chip">
        Step {{ totalSteps ? currentStepIndex + 1 : 0 }} of {{ totalSteps || 0 }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// ======= STATE =======
const route = useRoute()
const recipeId = route.params.id

const recipe = ref(null)
const currentStepIndex = ref(0)

const isCooking = ref(false)
const isPaused = ref(false)

const isRecording = ref(false)
const isTranscribing = ref(false)
const isListening = ref(false)
const isSpeaking = ref(false)

const isOnline = ref(navigator.onLine)
const isLiked = ref(false)

const speechStatus = ref(null)
const recordedTime = ref(0)
const transcriptionResult = ref('')
const transcriptionProgress = ref('')
const audioUrl = ref('')

const messages = ref([
  {
    type: 'assistant',
    text: "Hi! I'll guide you through your recipe. Tap Start when you're ready!",
    transcriptionSource: 'Assistant',
  },
])
const newMessage = ref('')
const currentSpeechText = ref('')

// Audio playback (for message.audioUrl)
const isPlayingMessageAudio = ref(false)
const currentPlayingAudio = ref('')
let playEl = null

// ======= COMPUTEDS =======
const currentInstruction = computed(
  () => recipe.value?.instructions?.[currentStepIndex.value] || '',
)

const isRecipeComplete = computed(() => {
  const total = recipe.value?.instructions?.length || 0
  return total > 0 && currentStepIndex.value >= total - 1
})

const progress = computed(() => {
  const total = recipe.value?.instructions?.length || 0
  if (!total) return 0
  return Math.round(((currentStepIndex.value + 1) / total) * 100)
})

// SAFE totals/index text everywhere
const totalSteps = computed(() => recipe.value?.instructions?.length || 0)

// Push an assistant bubble to chat
function pushAssistant(text) {
  messages.value.push({
    type: 'assistant',
    text,
    transcriptionSource: 'Assistant',
  })
}

// ======= UTIL =======
function showSpeechStatus(type, message) {
  speechStatus.value = { type, message }
  setTimeout(() => (speechStatus.value = null), 3500)
}

function getVisualizerHeight() {
  return isRecording.value ? 16 + Math.random() * 48 : 8
}

// ======= API =======
async function getRecipe(id) {
  try {
    const res = await axios.get(`http://localhost:8000/api/recipe/findRecipe/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    const arr = res.data?.data || []
    if (arr.length) recipe.value = arr[0]
  } catch (err) {
    showSpeechStatus('error', 'Failed to load recipe.')
  }
}

onMounted(async () => {
  await getRecipe(recipeId)
  window.addEventListener('online', () => (isOnline.value = true))
  window.addEventListener('offline', () => (isOnline.value = false))
})

// ======= TTS (simple) =======
const synthesis = window.speechSynthesis
function speakText(text) {
  return new Promise((resolve) => {
    currentSpeechText.value = text
    if (!('speechSynthesis' in window)) return resolve()
    try {
      const u = new SpeechSynthesisUtterance(text)
      isSpeaking.value = true
      u.onend = () => {
        isSpeaking.value = false
        resolve()
      }
      u.onerror = () => {
        isSpeaking.value = false
        resolve()
      }
      synthesis.cancel()
      synthesis.speak(u)
    } catch {
      isSpeaking.value = false
      resolve()
    }
  })
}
function speakMessage(text) {
  if (!text) return
  speakText(text)
}

// ======= Step controls =======
async function startRecipeSession() {
  if (!totalSteps.value) {
    showSpeechStatus('error', 'No instructions found.')
    return
  }
  isCooking.value = true
  isPaused.value = false
  currentStepIndex.value = 0

  const text = `Step 1: ${currentInstruction.value}`
  pushAssistant(text)
  await speakText(text)
}

async function nextStep() {
  if (!totalSteps.value) return
  if (currentStepIndex.value < totalSteps.value - 1) {
    currentStepIndex.value += 1
    const text = `Step ${currentStepIndex.value + 1}: ${currentInstruction.value}`
    pushAssistant(text)
    await speakText(text)
  } else {
    const done = 'That was the final step. Great job!'
    pushAssistant(done)
    await speakText(done)
  }
}

async function repeatInstruction() {
  if (!totalSteps.value) return
  const text = `Step ${currentStepIndex.value + 1}: ${currentInstruction.value}`
  pushAssistant(text)
  await speakText(text)
}

function previousStep() {
  if (!recipe.value) return
  if (currentStepIndex.value > 0) currentStepIndex.value -= 1
}

async function completeCooking() {
  await speakText('Recipe complete! Bon appétit!')
}

function toggleLike() {
  isLiked.value = !isLiked.value
}

// ======= STOP COOKING =======
function stopCooking() {
  try {
    window.speechSynthesis.cancel()
  } catch {}
  stopAutoRecording()
  isCooking.value = false
  isPaused.value = false
  messages.value.push({
    type: 'assistant',
    text: 'Cooking session ended. See you next time! 👋',
    transcriptionSource: 'Assistant',
  })
  showSpeechStatus('info', 'Stopped cooking.')
}

// ======= Record & Transcribe =======
let audioContext = null
let analyser = null
let microphoneStream = null
let mediaRecorder = null
let audioChunks = []
let silenceTimeout = null
let startTs = 0

function toggleRecording() {
  // If recording, stop; else start
  if (isRecording.value) {
    stopAutoRecording()
  } else {
    startAutoRecording()
  }
}

async function startAutoRecording() {
  try {
    if (isRecording.value) return
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(microphoneStream)
    audioChunks = []
    isRecording.value = true
    recordedTime.value = 0
    startTs = Date.now()

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      // Build blob & preview URL
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' })
      audioUrl.value = URL.createObjectURL(blob)

      // Base64 encode for API
      const base64Audio = await new Promise((resolve) => {
        const r = new FileReader()
        r.onloadend = () => resolve(r.result.split(',')[1])
        r.readAsDataURL(blob)
      })

      // Transcribe
      isTranscribing.value = true
      transcriptionProgress.value = 'Uploading...'
      try {
        const resp = await axios.post(
          'http://localhost:8000/api/recipe/transcribe',
          { base64Audio, mimeType: blob.type },
          { headers: { 'Content-Type': 'application/json' } },
        )
        transcriptionProgress.value = 'Processing...'
        const raw = (resp?.data?.text || '').trim()
        transcriptionResult.value = raw

        if (raw) {
          messages.value.push({
            type: 'user',
            text: raw,
            transcriptionSource: 'Voice',
            timestamp: new Date().toISOString(),
          })
        }
      } catch {
        showSpeechStatus('error', 'Transcription failed.')
      } finally {
        isTranscribing.value = false
        transcriptionProgress.value = ''
      }
    }

    // VAD setup
    audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(microphoneStream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    source.connect(analyser)

    mediaRecorder.start(100)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const SILENCE_MS = 1000

    const loop = () => {
      if (!isRecording.value) return
      analyser.getByteFrequencyData(dataArray)
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
      recordedTime.value = Math.round((Date.now() - startTs) / 1000)

      if (avg > 20) {
        if (silenceTimeout) {
          clearTimeout(silenceTimeout)
          silenceTimeout = null
        }
      } else if (!silenceTimeout) {
        silenceTimeout = setTimeout(() => stopAutoRecording(), SILENCE_MS)
      }
      requestAnimationFrame(loop)
    }
    loop()
  } catch (e) {
    showSpeechStatus('error', 'Unable to access microphone.')
    isRecording.value = false
  }
}

function stopAutoRecording() {
  // stop MediaRecorder first to trigger onstop -> transcription
  try {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  } catch {}
  // cleanup devices
  if (microphoneStream) {
    microphoneStream.getTracks().forEach((t) => t.stop())
    microphoneStream = null
  }
  if (audioContext) {
    try {
      audioContext.close()
    } catch {}
    audioContext = null
  }
  silenceTimeout && clearTimeout(silenceTimeout)
  silenceTimeout = null
  analyser = null
  isRecording.value = false
}

// ======= Chat send =======
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return
  messages.value.push({ type: 'user', text })
  newMessage.value = ''

  // Example: echo back (replace with your AI endpoint if needed)
  const reply = 'Got it! Let me know if you want to repeat or move to the next step.'
  messages.value.push({ type: 'assistant', text: reply })
  await speakText(reply)
}

// ======= Misc: playback of saved message audio =======
function playMessageAudio(message) {
  if (!message.audioUrl) return
  if (isPlayingMessageAudio.value) {
    try {
      playEl && playEl.pause()
    } catch {}
    isPlayingMessageAudio.value = false
    currentPlayingAudio.value = ''
    return
  }
  playEl = new Audio(message.audioUrl)
  currentPlayingAudio.value = message.audioUrl
  isPlayingMessageAudio.value = true
  playEl.onended = () => {
    isPlayingMessageAudio.value = false
    currentPlayingAudio.value = ''
  }
  playEl.play().catch(() => {
    isPlayingMessageAudio.value = false
    currentPlayingAudio.value = ''
  })
}

// ======= Transcription helpers =======
function deleteRecording() {
  audioUrl.value = ''
  transcriptionResult.value = ''
}
function useTranscription() {
  if (!transcriptionResult.value) return
  newMessage.value = transcriptionResult.value
  transcriptionResult.value = ''
}
function retryTranscription() {
  if (!audioUrl.value) return
  // simple UX nudge
  showSpeechStatus('info', 'Please record again for better accuracy.')
}
</script>

<style scoped>
/* (Styling preserved from your version; trimmed for brevity where safe) */
/* You can keep your entire style section as-is; nothing below affects logic */

.recipe-page {
  width: 100vw;
  min-height: 100vh;
  font-family: 'Bricolage Grotesque', Arial, sans-serif;
  background: #fffaf1;
  color: #5b472e;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.recipe-header {
  text-align: center;
  padding: 20px;
  margin-bottom: 30px;
}
.recipe-name {
  font-size: 2.5rem;
  color: #ea563b;
  font-weight: bold;
  margin-bottom: 15px;
}
.recipe-image {
  width: 420px;
  height: 240px;
  object-fit: cover;
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(210, 170, 110, 0.2);
}
.main-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 25px;
  flex: 1;
  margin-bottom: 100px;
}
.panel {
  background: white;
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(210, 170, 110, 0.15);
  border: 2px solid rgba(234, 211, 151, 0.2);
}
.panel-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px dashed #f0e6d2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.panel-title {
  font-size: 1.4rem;
  color: #5b472e;
  font-weight: bold;
  margin: 0;
}

.ingredients-panel {
  grid-column: 2;
  grid-row: 1;
}
.chat-panel {
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
}
.instructions-panel {
  grid-column: 2;
  grid-row: 2;
}
.progress-panel {
  grid-column: 2;
  grid-row: 3;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  max-height: 350px;
  min-height: 350px;
}
.chat-panel .panel-header,
.chat-panel .network-status,
.chat-panel .speech-status,
.chat-panel .recording-visualizer,
.chat-panel .recording-playback,
.chat-panel .transcribing-status,
.chat-panel .current-step-indicator,
.chat-panel .step-navigation {
  flex-shrink: 0;
}

/* --- Center the Step Navigation buttons (in the chat panel) --- */
.step-navigation {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 16px;
  margin: 16px 0;
  border: 2px solid #dee2e6;
}
.step-navigation .step-buttons {
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center; /* align vertically */
  gap: 16px;
  flex-wrap: wrap; /* wrap on small screens */
}
.step-navigation .action-btn {
  min-width: 220px; /* make both buttons the same width */
}

/* --- Sticky footer centered with one tidy row of buttons --- */
.bottom-actions {
  position: sticky;
  bottom: 0;
  z-index: 50;
  display: flex;
  justify-content: center; /* center the whole group */
  align-items: center;
  gap: 16px;
  flex-wrap: wrap; /* wrap if needed on small screens */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 30%);
  padding: 16px 12px;
  margin-top: 8px;
  border-top: 1px solid #eee;
  border-radius: 16px;
  width: 100%;
}
.bottom-actions .action-btn {
  min-width: 220px; /* uniform button width */
}

/* Optional: keep the little "Step X of Y" chip snug at the end */
.step-counter-chip {
  background: #f1f1f5;
  color: #666;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Mobile tweaks so they still look centered */
@media (max-width: 640px) {
  .step-navigation .action-btn,
  .bottom-actions .action-btn {
    min-width: 160px;
  }
}

.chat-panel .chat-input-container {
  flex-shrink: 0;
  margin-top: auto;
}

.message {
  max-width: 85%;
  padding: 15px 20px;
  border-radius: 20px;
  font-size: 1rem;
  line-height: 1.4;
  position: relative;
}
.message.assistant {
  align-self: flex-start;
  background: linear-gradient(135deg, #f6ead6 0%, #f0e6d2 100%);
  border-top-left-radius: 8px;
}
.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #e7f2de 0%, #dde8d5 100%);
  border-top-right-radius: 8px;
}

.speak-message-btn,
.play-message-audio-btn {
  background: none;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  opacity: 0.7;
}
.speak-message-btn:hover,
.play-message-audio-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}
.message-source {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 5px;
  font-style: italic;
}

.chat-input-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  font-size: 1rem;
  border-radius: 20px;
  border: 2px solid #f0e6d2;
  background: #fffaf8;
  padding: 12px 20px;
  outline: none;
  transition: all 0.3s ease;
}
.send-btn,
.mic-btn {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.voice-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.voice-btn {
  border: none;
  border-radius: 15px;
  padding: 8px 15px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}
.voice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recording-visualizer {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
  border: 2px dashed #dee2e6;
  flex-shrink: 0;
}
.visualizer-bar {
  width: 6px;
  background: linear-gradient(to top, #ff6b6b, #ff8e8e);
  border-radius: 3px;
  animation: visualizerPulse 0.5s infinite alternate;
  min-height: 10px;
}
.recording-timer {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.progress-section {
  text-align: center;
  padding: 10px 0;
}
.progress-bar-outer {
  width: 100%;
  height: 20px;
  background: #f8f4e9;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 15px;
  border: 2px solid #f0e6d2;
}
.progress-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #ea563b 0%, #ff8a65 100%);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.bottom-actions {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px 30px;
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(210, 170, 110, 0.25);
  border: 2px solid rgba(234, 211, 151, 0.3);
  z-index: 100;
}
.action-btn {
  border: none;
  border-radius: 20px;
  padding: 15px 25px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.like-btn {
  background: linear-gradient(135deg, #ffe5e7 0%, #ffd5d8 100%);
  color: #e44a5c;
}
.like-btn.liked {
  background: linear-gradient(135deg, #ff8fa3 0%, #e44a5c 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(228, 74, 92, 0.4);
}
.stop-btn {
  background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}
.previous-btn {
  background: linear-gradient(135deg, #a9a9a9 0%, #808080 100%);
  color: white;
}
.previous-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

@keyframes visualizerPulse {
  from {
    opacity: 0.6;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: scaleY(1.2);
  }
}
/* Header */
.current-step-indicator {
  background: #fff7ea;
  border: 2px solid #ffe2b3;
  border-radius: 12px;
  padding: 14px;
  margin: 10px 0 6px;
}
.step-indicator-header h3 {
  margin: 0;
  color: #5b472e;
  font-size: 1.25rem;
}

/* Ingredients (pic 2) */
.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ingredient-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed #e8f0e0;
}
.ingredient-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #65b168;
}
.ingredient-name {
  color: #426b45;
  font-weight: 600;
}
.ingredient-portion {
  color: #6b7a67;
  font-weight: 600;
}

/* Instructions (pic 3) */
.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.instruction-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: #f8f9fa;
}
.instruction-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  background: #ea563b;
  flex-shrink: 0;
}
.instruction-item.completed {
  opacity: 0.7;
  background: #e8f5e8;
  border-color: #c8e6c9;
}
.instruction-item.completed .instruction-number {
  background: #51cf66;
}
.instruction-item.current {
  background: #fff3cd;
  border-color: #ffd54f;
  box-shadow: 0 4px 12px rgba(255, 213, 79, 0.3);
}
.instruction-item.current .instruction-number {
  background: #ffd54f;
  color: #5b472e;
}
.instruction-item.upcoming {
  opacity: 0.85;
}

/* Footer (pic 4) */
.bottom-actions {
  position: sticky;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 30%);
  padding: 16px 12px;
  margin-top: 8px;
  border-top: 1px solid #eee;
  border-radius: 16px;
}
.step-counter-chip {
  background: #f1f1f5;
  color: #666;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
}
/* Buttons tidy */
.action-btn {
  min-width: 170px;
}
.continue-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: #fff;
}
.repeat-btn {
  background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
  color: #fff;
}
.stop-btn {
  background: linear-gradient(135deg, #ffb74d 0%, #ff9800 100%);
  color: #fff;
}
.previous-btn {
  background: linear-gradient(135deg, #a9a9a9 0%, #808080 100%);
  color: #fff;
}
</style>
