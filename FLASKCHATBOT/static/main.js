import { GoogleGenerativeAI } from "@google/generative-ai";
const conv = new showdown.Converter();

const genAI = new GoogleGenerativeAI("AIzaSyBADc0Lqp0x71w7z0dhwzFpAGUTIiOiHbE");
const gen_model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = gen_model.startChat({
    generationConfig: {
        maxOutputTokens: 1000,
    },
});

const chatGemini = async (message) => {
    addMessage(message, "end");
    let res = await chat.sendMessage(message);
    res = await res.response;
    console.log(res);
    let html = conv.makeHtml(res.text());
    addMessage(html, "start");
}

const addMessage = (msg, direction) => {
    const messageHolder = document.getElementById("messageHolder");
    const message = document.createElement("div");
    const colour = direction !== "start" ? "blue" : "gray"; // Change color to gray for incoming messages
    message.innerHTML = `
        <div class="flex flex-col items-${direction}">
            <div class="bg-${colour}-500 px-4 py-2 rounded-md text-white w-fit 
            max-w-4xl mb-1">${msg}</div>
        </div>
    `;
    messageHolder.appendChild(message);
}


const messageInput = document.getElementById("chat");
const sendBtn = document.getElementById("btn");

// Event listener for the form submission
document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    const message = messageInput.value;
    if (message.toLowerCase().includes("fetch mdc info")) {
        fetchMDCInfo(); // Fetch MDC info only if the query includes "fetch mdc info"
    } else {
        chatGemini(message); // Otherwise, send the message to the Gemini chatbot
    }
    messageInput.value = ""; // Clear the input field
});

// Function to fetch MDC info
function fetchMDCInfo() {
    fetch("/fetch-mdc-info")
        .then(response => response.json())
        .then(data => {
            addMessage(JSON.stringify(data), "start"); // Display the fetched MDC info
        })
        .catch(error => {
            console.error('Error fetching MDC info:', error);
            addMessage("Failed to fetch MDC info.", "start");
        });
}
