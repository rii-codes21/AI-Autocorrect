const input = document.getElementById("inputText");
const output = document.getElementById("output");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");

const correctBtn = document.getElementById("correctBtn");
const professionalBtn = document.getElementById("professionalBtn");
const casualBtn = document.getElementById("casualBtn");
const enhanceBtn = document.getElementById("enhanceBtn");

const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const voiceBtn = document.getElementById("voiceBtn");

// ==============================
// Live Counter
// ==============================

function updateStats() {
    const text = input.value.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;

    wordCount.textContent = `${words} Words`;
    charCount.textContent = `${input.value.length} Characters`;
}

input.addEventListener("input", updateStats);

// ==============================
// Typing Animation
// ==============================

async function typeText(text) {

    output.innerHTML = "";

    for (let i = 0; i < text.length; i++) {

        output.innerHTML += text.charAt(i);

        output.scrollTop = output.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 8));

    }

}

// ==============================
// Send to AI
// ==============================

async function sendRequest(action) {

    if (input.value.trim() === "") {

        alert("Please enter some text.");

        return;

    }

    output.innerHTML = `
        <div class="loader"></div>
        <p style="text-align:center">AI is thinking...</p>
    `;

    try {

        const response = await fetch("http://localhost:3000/process", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                text: input.value,

                action: action

            })

        });

        const data = await response.json();

        await typeText(data.result);

    }

    catch (err) {

        output.innerHTML = "❌ Unable to connect to Gemini AI.";

        console.error(err);

    }

}

// ==============================
// Buttons
// ==============================

correctBtn.onclick = () => sendRequest("correct");

professionalBtn.onclick = () => sendRequest("professional");

casualBtn.onclick = () => sendRequest("casual");

enhanceBtn.onclick = () => sendRequest("correct");

// ==============================
// Copy
// ==============================

copyBtn.onclick = async () => {

    await navigator.clipboard.writeText(output.innerText);

    copyBtn.innerHTML = "✅ Copied";

    setTimeout(() => {

        copyBtn.innerHTML = "📋 Copy";

    }, 1500);

};

// ==============================
// Clear
// ==============================

clearBtn.onclick = () => {

    input.value = "";

    updateStats();

    output.innerHTML = "Your corrected text will appear here...";

};

// ==============================
// Download
// ==============================

downloadBtn.onclick = () => {

    const blob = new Blob([output.innerText], {

        type: "text/plain"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "AI_Output.txt";

    link.click();

};

// ==============================
// Voice Input
// ==============================

if ("webkitSpeechRecognition" in window) {

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    voiceBtn.onclick = () => {

        recognition.start();

    };

    recognition.onresult = (event) => {

        input.value += event.results[0][0].transcript;

        updateStats();

    };

} else {

    voiceBtn.style.display = "none";

}

updateStats();