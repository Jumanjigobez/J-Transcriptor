// Function to ease retrieval of DOM elements
const elem = (x) => document.querySelector(x);

// Initialize the SpeechRecognition API
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = true; // Continue recognizing speech

// Get references to DOM elements
const txt_recorded = elem("#txt_recorded"),
  toggleButton = elem("#toggle_button"),
  clearButton = elem("#clear_button"),
  copyButton = elem("#copy_button");

// Track whether the recording is active
let isRecording = false;

// Track the last result to avoid duplicates
let lastTranscript = "";

// Regular expressions for special commands
const commandPatterns = {
  paragraph: /\bparagraph\b/i,
  fullStop: /\bfull stop\b/i,
  comma: /\bcomma\b/i,
  question: /\bquestion\b/i,
};

// Update text area with new speech results
const handleSpeechResult = (event) => {
  // Track the latest results
  let newTranscript = "";

  // Loop through all results
  for (const result of event.results) {
    if (result.isFinal) {
      newTranscript = result[0].transcript.trim();
    }
  }

  // Process special commands
  if (newTranscript) {
    if (commandPatterns.paragraph.test(newTranscript)) {
      txt_recorded.value += "\n\n"; // Insert two newlines for paragraph
    } else if (commandPatterns.fullStop.test(newTranscript)) {
      txt_recorded.value += ". "; // Insert a full stop and space
    } else if (commandPatterns.comma.test(newTranscript)) {
      txt_recorded.value += ", "; // Insert a comma and space
    } else if (commandPatterns.question.test(newTranscript)) {
      txt_recorded.value += "? "; // Insert a question mark and space
    } else if (newTranscript !== lastTranscript) {
      txt_recorded.value += newTranscript + " ";
    }
    lastTranscript = newTranscript; // Update last transcript

    // Scroll to the bottom of the textarea
    txt_recorded.scrollTop = txt_recorded.scrollHeight;
  }
};

// Handle button click to toggle recording
const handleToggleRecording = () => {
  if (isRecording) {
    // Stop recording
    recognition.stop();
    toggleButton.textContent = "Start Speaking";
    toggleButton.classList.remove("active");
    isRecording = false;
  } else {
    txt_recorded.focus(); // Ensure textarea has focus
    recognition.start();
    toggleButton.textContent = "Stop";
    toggleButton.classList.add("active");
    isRecording = true;
  }
};

const handleClearResult = () => {
  txt_recorded.value = ""; // Clear the textarea
  lastTranscript = ""; // Reset last transcript
};

const handleCopyText = () => {
  txt_recorded.select();

  // Copy the selected text to the clipboard
  try {
    document.execCommand("copy");
  } catch (err) {
    alert("Failed to copy text :(");
  }
};

// Event listeners
recognition.onresult = handleSpeechResult;
recognition.onend = () => {
  if (isRecording) {
    recognition.start(); // Restart if needed
  }
};

// Track button clicks
toggleButton.addEventListener("click", handleToggleRecording);

setInterval(() => {
  if (txt_recorded.value !== "") {
    clearButton.classList.add("active");
    copyButton.classList.add("active");
  } else {
    clearButton.classList.remove("active");
    copyButton.classList.remove("active");
  }
}, 100);

clearButton.addEventListener("click", handleClearResult);
copyButton.addEventListener("click", handleCopyText);
