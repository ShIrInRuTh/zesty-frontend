export const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
}

export function createRecognition(lang = 'en-US') {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Recognition) throw new Error('Speech recognition not supported.')
  const rec = new Recognition()
  rec.continuous = false
  rec.interimResults = false
  rec.lang = lang
  return rec
}

export function speak(
  speechSynthesis,
  selectedVoice,
  transcript,
  setTranscript,
  text,
  lang = 'en-US',
) {
  return new Promise((resolve) => {
    setTranscript((prev) => [...prev, { speaker: 'Olivia', text }])
    const utter = new window.SpeechSynthesisUtterance(text)
    utter.voice = selectedVoice.value
    utter.pitch = 1
    utter.rate = 0.92
    utter.volume = 1
    utter.lang = lang
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    speechSynthesis.speak(utter)
  })
}

export async function handleAIConversation(apiBaseURL, recipe, question) {
  try {
    const response = await fetch(`${apiBaseURL}/api/talk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeName: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        userQuestion: question,
      }),
    })
    const data = await response.json()
    return data.text || data.response || "Sorry, I couldn't get a response."
  } catch (error) {
    return 'Error communicating with AI backend.'
  }
}

// TODO: Fix the handle command logic so it can handle continue and repeat properly

export async function handleCommand({
  command,
  recipe,
  currentStep,
  isPaused,
  recognition,
  speakFunc,
  speakStep,
  setIsCooking,
  synthesis,
  apiBaseURL,
  hasIntroducedOlivia,
  setHasIntroducedOlivia,
  listenForQuestion,
  startListening,
}) {
  // PAUSED state
  if (isPaused.value) {
    if (command.includes('next') || command.includes('continue')) {
      currentStep.value++
      if (currentStep.value < recipe.value.instructions.length) {
        await speakStep(currentStep.value)
      } else {
        await speakFunc("Congratulations! You've completed the recipe!")
      }
      return
    }

    if (command.includes('repeat')) {
      await speakStep(currentStep.value)
      return
    }
    if (command.includes('jump')) {
      // JUMP logic as below...
      const numberMatch = command.match(
        /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i,
      )
      let stepNumber
      if (numberMatch) {
        const numberString = numberMatch[1].toLowerCase()
        stepNumber = parseInt(numberString, 10) || numberWords[numberString]
      }
      if (stepNumber && stepNumber <= recipe.value.instructions.length) {
        currentStep.value = stepNumber - 1
        await speakStep(currentStep.value)
      } else {
        await speakFunc('Invalid step number. Please try again.')
      }
      return
    }
    if (command.includes('end')) {
      synthesis.cancel()
      recognition && recognition.abort && recognition.abort()
      currentStep.value = 0
      setIsCooking(false)
      await speakFunc('Ending the session. Great job cooking!')
      return
    }
    await speakFunc("Still paused. Say 'continue' or 'next' to resume, or 'end' to finish.")
    return
  }

  // Unpaused state
  if (command.includes('pause')) {
    isPaused.value = true
    await speakFunc("Paused. Say 'continue' or 'next' to resume, or 'end' to finish.")
    return
  }
  if (command.includes('end')) {
    await speakFunc('Ending session, goodbye!')
    synthesis.cancel()
    recognition && recognition.abort && recognition.abort()
    currentStep.value = 0
    setIsCooking(false)
    return
  }
  if (command.includes('repeat')) {
    await speakStep(currentStep.value)
    return
  }
  if (command.includes('next') || command.includes('continue')) {
    currentStep.value++
    if (currentStep.value < recipe.value.instructions.length) {
      await speakStep(currentStep.value)
    } else {
      await speakFunc("Congratulations! You've completed the recipe!")
    }
    return
  }
  if (command.includes('jump')) {
    const numberMatch = command.match(
      /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/i,
    )
    let stepNumber
    if (numberMatch) {
      const numberString = numberMatch[1].toLowerCase()
      stepNumber = parseInt(numberString, 10) || numberWords[numberString]
    }
    if (stepNumber && stepNumber <= recipe.value.instructions.length) {
      currentStep.value = stepNumber - 1
      await speakStep(currentStep.value)
    } else {
      await speakFunc('Invalid step number. Please try again.')
    }
    return
  }
  await speakFunc("Sorry, I didn't understand that. Please try again.")
}
