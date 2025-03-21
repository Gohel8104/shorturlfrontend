document.getElementById("chatToggle").addEventListener("click", () => {
    document.getElementById("chatContainer").classList.toggle("hidden");
});

document.getElementById("closeChat").addEventListener("click", () => {
    document.getElementById("chatContainer").classList.add("hidden");
});

document.getElementById("sendBtn").addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value.trim();
    const chatHistory = document.getElementById("chatHistory");

    if (!userInput) return;


    addMessage(userInput, "user");

    
    document.getElementById("userInput").value = "";

    addMessage("Thinking...", "ai");

    const apiKey = "AIzaSyD1FgMTAHO54ebOshWGnYDpoBjCYr0N6pU";  

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";

        // Remove loading message
        chatHistory.lastChild.remove();

        // Add AI response to chat
        addMessage(aiResponse, "ai");
    } catch (error) {
        chatHistory.lastChild.remove();
        addMessage("Error fetching response.", "ai");
        console.error(error);
    }
});

function addMessage(text, sender) {
    const chatHistory = document.getElementById("chatHistory");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-bubble", sender);
    messageDiv.innerText = text;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;  // Auto-scroll
}
