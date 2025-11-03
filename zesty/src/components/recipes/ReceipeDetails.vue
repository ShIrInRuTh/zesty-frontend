<template>
  <div class="recipe-page">
    <div class="recipe-header">
      <h1 class="recipe-name">{{ recipe.title }}</h1>
      <img :src="recipe.image" alt="Recipe photo" class="recipe-image" />
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
              :disabled="isCooking || isRecipeComplete"
            >
              <span class="btn-icon">🍳</span>
              Start Recipe
            </button>

            <button
              class="voice-btn speak-btn"
              @click="toggleSpeech"
              :class="{ active: isSpeaking }"
              :disabled="isListening || isRecording"
            >
              <span class="btn-icon">{{ isSpeaking ? '🔊' : '🔈' }}</span>
              {{ isSpeaking ? 'Speaking...' : 'Read Aloud' }}
            </button>
            <button @click="startAutoRecording" :disabled="isRecording">
              🎙 Record Question/Command
            </button>
            <button
              class="voice-btn record-btn"
              @click="toggleRecording"
              :class="{
                active: isRecording,
                recording: isRecording,
              }"
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

          <!-- Transcription Result -->
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
        <div v-if="currentInstruction" class="current-step-indicator">
          <div class="step-indicator-header">
            <h3>Current Step: {{ currentStepIndex + 1 }} of {{ recipe.instructions.length }}</h3>
          </div>
        </div>

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

        <!-- Step Navigation Buttons - Moved below chat but above input -->
        <!-- Step Navigation Buttons -->
        <div v-if="currentInstruction || isRecipeComplete" class="step-navigation">
          <div class="step-buttons">
            <button v-if="!isRecipeComplete" class="action-btn continue-btn" @click="nextStep">
              <span class="btn-icon">✅</span>
              {{
                currentStepIndex === recipe.instructions.length - 1
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

            <!-- Complete Cooking Button -->
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
                : `Step ${currentStepIndex + 1} of ${recipe.instructions.length}`
            }}
          </div>
        </div>

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
            :class="{
              active: isRecording,
              recording: isRecording,
            }"
            :disabled="isSpeaking || isListening"
            title="Record Voice Note"
          >
            <span class="mic-icon">{{ isRecording ? '⏹️' : '🎙️' }}</span>
          </button>
        </div>
      </div>

      <!-- Instructions Panel -->
      <div class="panel instructions-panel">
        <div class="panel-header">
          <h2 class="panel-title">Instructions 📝</h2>
          <div class="steps-counter">
            Step {{ currentStepIndex + 1 }} of {{ recipe.instructions.length }}
          </div>
        </div>
        <div class="instructions-list">
          <div
            v-for="(instruction, index) in recipe.instructions"
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
            v-for="(ingredient, index) in recipe.ingredients"
            :key="index"
            class="ingredient-item"
          >
            <span class="ingredient-dot"></span>
            {{ ingredient }}
          </li>
        </ul>
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
            Step {{ currentStepIndex + 1 }} of {{ recipe.instructions.length }}
          </div>
        </div>
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
      <button class="action-btn stop-btn" @click="stopCooking">
        <span class="btn-icon">⏹️</span>
        Stop Cooking
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  handleCommand,
  speak,
  createRecognition,
  numberWords,
  handleAIConversation,
} from './voiceLogic'

const recipe = ref({
  title: 'Avocado Toast',
  image:
    'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  ingredients: [
    '2 slices bread',
    '1 ripe avocado',
    'Salt to taste',
    'Pepper to taste',
    'Tomatoes or eggs (optional)',
    'Red pepper flakes',
    'Lemon juice',
  ],
  instructions: [
    'Toast your bread until golden brown and crispy (about 2-3 minutes)',
    'While bread toasts, cut avocado in half, remove pit, scoop out flesh',
    'Mash avocado in a bowl to desired consistency',
    'Add lemon juice, salt, and pepper to avocado',
    'Spread mixture on toast',
    'Sprinkle with red pepper flakes and toppings',
    'Serve and enjoy!',
  ],
})

const currentStepIndex = ref(0)
const currentInstruction = computed(() => recipe.value.instructions[currentStepIndex.value] || '')
const isRecipeComplete = computed(() => currentStepIndex.value >= recipe.value.instructions.length)
const progress = ref(0)

async function speakStepWithChat(idx) {
  const instr = recipe.value.instructions[idx]
  const text = `Step ${idx + 1}: ${instr}.`
  console.log(text)
  messages.value.push({
    type: 'assistant',
    text,
    transcriptionSource: 'Assistant',
  })
  console.log(messages)
  await speak(
    synthesis,
    selectedVoice,
    messages.value, // Pass the array itself, not just ref
    (message) => messages.value.push(message), // Push new message
    text,
  )
    .then(() => {
      startAutoRecording()
      stopAutoRecording()
    })
    .catch((error) => {
      console.error(error)
      stopAutoRecording()
    })
}

function updateProgress() {
  progress.value = isRecipeComplete.value
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          Math.round((currentStepIndex.value / (recipe.value.instructions.length - 1)) * 100),
        ),
      )
}

function getVisualizerHeight(n) {
  return isRecording.value ? 16 + Math.random() * 48 : 8
}

const messages = ref([
  {
    type: 'assistant',
    text: "Hi! I'll guide you through making avocado toast. Let's start with the first step!",
    transcriptionSource: 'Assistant',
  },
])

const transcript = messages
const newMessage = ref('')
const isLiked = ref(false)
const isSpeaking = ref(false)
const isListening = ref(false)
const isRecording = ref(false)
const speechStatus = ref(null)
const currentSpeechText = ref('')
const recordedTime = ref(0)
const audioUrl = ref(null)
const transcriptionResult = ref('')
const isTranscribing = ref(false)
const transcriptionProgress = ref('')

const synthesis = window.speechSynthesis
const selectedVoice = ref(null)
const recognition = ref(null)
const isOnline = ref(navigator.onLine)
const hasIntroducedOlivia = ref(false)
const isCooking = ref(false)
const isPaused = ref(true)

let mediaRecorder = null
let audioChunks = []
let recordingTimer = null

function showSpeechStatus(type, message) {
  speechStatus.value = { type, message }
  setTimeout(() => (speechStatus.value = null), 5000)
}

function setTranscript(updateFn) {
  transcript.value = updateFn(transcript.value)
}
function setIsCooking(val) {
  isCooking.value = val
}
function setHasIntroducedOlivia(val) {
  hasIntroducedOlivia.value = val
}

function pickPreferredVoice() {
  const voices = synthesis.getVoices()
  selectedVoice.value =
    voices.find(
      (v) =>
        v.name.includes('Microsoft Mark') ||
        v.name.includes('Samantha') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Natural'),
    ) ||
    voices[0] ||
    null
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = pickPreferredVoice
  pickPreferredVoice()
}

let audioContext = null
let analyser = null
let microphoneStream = null
let silenceTimeout = null
let speaking = false

async function startAutoRecording() {
  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(microphoneStream)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' })
      const mimeType = audioBlob.type
      const base64Audio = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.readAsDataURL(audioBlob)
      })
      isTranscribing.value = true
      try {
        const response = await axios.post(
          'http://localhost:8000/api/recipe/transcribe',
          {
            base64Audio,
            mimeType,
          },
          { headers: { 'Content-Type': 'application/json' } },
        )
        const data = response.data
        stopAutoRecording()
        console.log(data.text, response)
        if (data.text) {
          console.log('i am here')
          const cleaned = data.text
            .trim()
            .toLowerCase()
            .replace(/[^\w\s]|_/g, '')
          console.log(cleaned, ['continue', 'repeat', 'next', 'pause', 'end'].includes(cleaned))
          if (['continue', 'repeat', 'next', 'pause', 'end'].includes(cleaned)) {
            await handleCommand({
              command: cleaned,
              recipe,
              currentStep: currentStepIndex,
              isPaused,
              recognition: null,
              speakFunc: (txt) => {
                messages.value.push({
                  type: 'assistant',
                  text: txt,
                  transcriptionSource: 'Assistant',
                })
                return speak(
                  synthesis,
                  selectedVoice,
                  messages,
                  (v) => (messages.value = [...v]),
                  txt,
                )
              },

              speakStep: speakStepWithChat,
              setIsCooking,
              synthesis,
              apiBaseURL: 'http://localhost:8000/api/recipe' || '',
              hasIntroducedOlivia,
              setHasIntroducedOlivia,
              listenForQuestion: async () => prompt('Ask your question (or speak here):') || '',
              startListening,
            })
          } else {
            await processTranscriptionAsQuestion(data.text)
          }
        }
      } finally {
        isTranscribing.value = false
      }
    }

    audioContext = new AudioContext()
    const sourceNode = audioContext.createMediaStreamSource(microphoneStream)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    sourceNode.connect(analyser)
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray)
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length
      const threshold = 20
      if (volume > threshold) {
        if (!speaking) {
          speaking = true
          mediaRecorder.start()
          isRecording.value = true
          if (silenceTimeout) clearTimeout(silenceTimeout)
        }
      } else if (speaking && !silenceTimeout) {
        silenceTimeout = setTimeout(() => {
          speaking = false
          mediaRecorder.stop()
          isRecording.value = false
          silenceTimeout = null
        }, 1000)
      }
      if (isCooking.value) requestAnimationFrame(checkVolume)
    }
    checkVolume()
  } catch (e) {
    showSpeechStatus('error', 'Unable to access microphone.')
  }
}

function stopAutoRecording() {
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  if (microphoneStream) {
    microphoneStream.getTracks().forEach((track) => track.stop())
    microphoneStream = null
  }
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
  silenceTimeout = null
  speaking = false
}

async function processTranscriptionAsQuestion(transcription) {
  newMessage.value = transcription
  messages.value.push({
    type: 'user',
    text: transcription,
    transcriptionSource: 'Voice Transcription',
    timestamp: new Date().toISOString(),
  })

  const responseText = await handleAIConversation(
    'http://localhost:8000/api/recipe/talk',
    recipe.value,
    transcription,
  )

  messages.value.push({
    type: 'assistant',
    text: responseText,
    transcriptionSource: 'AI Assistant',
    timestamp: new Date().toISOString(),
  })

  await speak(synthesis, selectedVoice, transcript, setTranscript, responseText)
}

function startListening() {
  if (recognition.value && !isListening.value && !isRecording.value) {
    showSpeechStatus(
      'info',
      "Listening... Say 'next', 'repeat', 'pause', 'continue', or ask a question.",
    )
    try {
      recognition.value.start()
    } catch (e) {}
  }
}

// Startup: only speak and record when recipe session begins
function startRecipeSession() {
  isCooking.value = true
  currentStepIndex.value = 0
  speak(
    synthesis,
    selectedVoice,
    transcript,
    setTranscript,
    `Let's begin! Step 1: : ${recipe.value.instructions[0]}`,
  ).then(() => {
    showSpeechStatus('info', 'Recipe started. I am listening for commands!')
    startAutoRecording() // <-- starts VAD only AFTER instructions are spoken
  })
}

function stopCooking() {
  synthesis.cancel()
  isCooking.value = false
  stopAutoRecording()
  messages.value.push({
    type: 'assistant',
    text: 'Cooking session ended. Hope you enjoyed making avocado toast! 🥑',
    transcriptionSource: 'Assistant',
  })
}

// Your other existing methods stay unchanged...

window.addEventListener('online', () => (isOnline.value = true))
window.addEventListener('offline', () => (isOnline.value = false))
</script>

<style scoped>
/* Consolidated Recipe App Styles */

/* === LAYOUT === */
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

/* === PANELS === */
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

/* === GRID POSITIONING === */
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

/* === CHAT STYLES === */
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

.message-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-actions {
  display: flex;
  gap: 5px;
  margin-left: 10px;
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

.chat-input:focus {
  border-color: #ead397;
  background: white;
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

.send-btn {
  background: linear-gradient(135deg, #ffe5e7 0%, #ffd5d8 100%);
}

.mic-btn {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.mic-btn.active {
  background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%);
  color: white;
  animation: pulse 1.5s infinite;
}

.send-btn:hover,
.mic-btn:hover:not(.active) {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* === VOICE CONTROLS === */
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
  transform: none !important;
}

.speak-btn {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border: 2px solid #bbdefb;
}

.speak-btn.active {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.record-btn {
  background: linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%);
  color: #d84315;
  border: 2px solid #ffccbc;
}

.record-btn.active,
.record-btn.recording {
  background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
  color: white;
  animation: pulse 1s infinite;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.mic-btn.recording {
  background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
  color: white;
  animation: pulse 1s infinite;
}

.voice-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* === RECORDING STYLES === */
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

.recording-playback {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 15px;
  margin: 10px 0;
  border: 2px solid #dee2e6;
  flex-shrink: 0;
}

.playback-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.play-btn,
.transcribe-btn,
.delete-btn {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.play-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
}

.transcribe-btn {
  background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
  color: white;
}

.delete-btn {
  background: linear-gradient(135deg, #fa5252 0%, #e03131 100%);
  color: white;
}

.play-btn:hover,
.transcribe-btn:hover,
.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.transcribing-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 10px;
  margin: 10px 0;
  color: #856404;
  font-weight: 600;
  flex-shrink: 0;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffeaa7;
  border-top: 2px solid #856404;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* === TRANSCRIPTION === */
.transcription-result {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  border: 1px solid #bbdefb;
}

.transcription-result h4 {
  margin: 0 0 10px 0;
  color: #1976d2;
  font-size: 1rem;
}

.transcribed-text {
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #90caf9;
  margin-bottom: 10px;
  font-style: italic;
  line-height: 1.4;
}

.transcription-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.use-text-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.use-text-btn:hover,
.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.transcription-progress {
  font-size: 0.8rem;
  margin-top: 5px;
  color: #666;
}

/* === INGREDIENTS === */
.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  margin-bottom: 15px;
  font-size: 1.05rem;
  color: #5b7551;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #e8f0e0;
}

.ingredient-dot {
  background: #89b056;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 15px;
  flex-shrink: 0;
}

/* === INSTRUCTIONS === */
.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instruction-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.instruction-item.completed {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border-color: #c8e6c9;
  opacity: 0.7;
}

.instruction-item.current {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-color: #ffd54f;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 213, 79, 0.3);
}

.instruction-item.upcoming {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-color: #e9ecef;
  opacity: 0.6;
}

.instruction-number {
  background: #ea563b;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.instruction-item.completed .instruction-number {
  background: #51cf66;
}

.instruction-item.current .instruction-number {
  background: #ffd54f;
  color: #856404;
}

.instruction-text {
  flex: 1;
  line-height: 1.4;
  font-weight: 500;
}

.steps-counter {
  background: #856404;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* === STEP NAVIGATION === */
.current-step-indicator {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  border: 2px solid #ffd54f;
  flex-shrink: 0;
}

.step-indicator-header h3 {
  margin: 0;
  color: #856404;
  font-size: 1.1rem;
  text-align: center;
}

.step-navigation {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 20px;
  margin: 15px 0;
  border: 2px solid #dee2e6;
  flex-shrink: 0;
}

.step-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.continue-btn {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.repeat-btn {
  background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.complete-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #fa5252 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.continue-btn:hover,
.repeat-btn:hover,
.complete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.step-progress-mini {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

/* === PROGRESS === */
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
  box-shadow: 0 2px 8px rgba(234, 86, 59, 0.3);
}

.progress-text {
  color: #71644e;
  font-weight: 700;
  font-size: 1.1rem;
}

/* === BOTTOM ACTIONS === */
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

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* === STATUS MESSAGES === */
.network-status,
.speech-status {
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
}

.network-status.error {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #ef6c00;
  border: 1px solid #ffb74d;
}

.speech-status.info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.speech-status.success {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.speech-status.error {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.browser-warning {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #ef6c00;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #ffb74d;
  z-index: 1000;
  max-width: 90%;
}

/* === ANIMATIONS === */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* === RESPONSIVE DESIGN === */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
  }

  .ingredients-panel {
    grid-column: 1;
    grid-row: 1;
  }
  .chat-panel {
    grid-column: 1;
    grid-row: 2;
    height: 500px;
    min-height: 500px;
    max-height: 500px;
  }
  .instructions-panel {
    grid-column: 1;
    grid-row: 3;
  }
  .progress-panel {
    grid-column: 1;
    grid-row: 4;
  }

  .chat-messages {
    max-height: 300px;
    min-height: 300px;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
  }
  .voice-controls {
    justify-content: center;
  }

  .bottom-actions {
    flex-direction: column;
    width: 90%;
    max-width: 300px;
  }

  .recipe-image {
    width: 90vw;
    height: 200px;
  }
  .recipe-name {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .recipe-page {
    padding: 15px;
  }
  .panel {
    padding: 20px;
    border-radius: 20px;
  }

  .chat-panel {
    height: 450px;
    min-height: 450px;
    max-height: 450px;
  }

  .chat-messages {
    max-height: 250px;
    min-height: 250px;
  }

  .bottom-actions {
    bottom: 20px;
    padding: 15px 20px;
  }

  .action-btn {
    padding: 12px 20px;
    font-size: 0.95rem;
    min-width: 140px;
  }

  .voice-btn {
    min-width: 100px;
    font-size: 0.8rem;
  }
}

/* === SCROLLBAR === */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f8f4e9;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ead397;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #e4c97e;
}
</style>
