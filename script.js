// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const themeToggle = document.getElementById('themeToggle');
const typingIndicator = document.getElementById('typingIndicator');
const quickSuggestions = document.getElementById('quickSuggestions');

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save theme preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Initial suggestions
const initialSuggestions = [
    "I have a headache",
    "Fever symptoms",
    "Stomach pain",
    "Common cold"
];

// Disease database with symptoms and information
const diseaseDatabase = {
    "headache": {
        response: "Based on your symptoms, you might be experiencing a tension headache, migraine, or cluster headache. Common causes include stress, dehydration, eye strain, or lack of sleep.",
        advice: "Try resting in a quiet, dark room, staying hydrated, and taking over-the-counter pain relievers if appropriate. If headaches are severe or persistent, please consult a healthcare professional.",
        followUp: ["Is your headache on one side?", "Do you have any visual disturbances?", "How long have you had this headache?"]
    },
    "fever": {
        response: "A fever is typically a sign that your body is fighting an infection. Common causes include viral infections like the flu, bacterial infections, or inflammatory conditions.",
        advice: "Rest, stay hydrated, and take fever-reducing medication if appropriate. If your fever is above 103°F (39.4°C) or lasts more than three days, please seek medical attention.",
        followUp: ["Do you have any other symptoms?", "How high is your temperature?", "When did the fever start?"]
    },
    "cough": {
        response: "Coughing can be caused by various conditions including common cold, flu, allergies, asthma, or more serious respiratory infections.",
        advice: "Stay hydrated, use honey (if over 1 year old) for soothing, and consider over-the-counter cough medicine. If you have difficulty breathing or the cough persists for more than two weeks, please consult a doctor.",
        followUp: ["Is your cough dry or productive?", "Do you have any other symptoms?", "How long have you been coughing?"]
    },
    "stomach pain": {
        response: "Stomach pain can result from indigestion, gas, stomach virus, food poisoning, constipation, or more serious conditions like appendicitis or gallstones.",
        advice: "Try resting, avoiding solid foods temporarily, staying hydrated, and using a heating pad. If pain is severe, accompanied by fever, or lasts more than a few days, please seek medical attention.",
        followUp: ["Where exactly is the pain located?", "Does the pain come and go or is it constant?", "Have you experienced nausea or vomiting?"]
    },
    "sore throat": {
        response: "A sore throat is commonly caused by viral infections like the common cold or flu, bacterial infections like strep throat, or irritants like dry air or allergies.",
        advice: "Gargle with warm salt water, drink warm liquids, use throat lozenges, and rest your voice. If you have difficulty swallowing or breathing, seek immediate medical attention.",
        followUp: ["Do you have a fever?", "Can you see white patches on your tonsils?", "How long have you had the sore throat?"]
    },
    "cold": {
        response: "The common cold is a viral infection affecting your upper respiratory tract. Symptoms typically include runny nose, congestion, sneezing, sore throat, and mild cough.",
        advice: "Rest, stay hydrated, use over-the-counter cold medications for symptom relief, and consider using a humidifier. Most colds resolve within 7-10 days.",
        followUp: ["How long have you had these symptoms?", "Do you have a fever?", "Have you been exposed to anyone who is sick?"]
    },
    "flu": {
        response: "Influenza (flu) is a viral infection that attacks your respiratory system. Symptoms include fever, chills, muscle aches, cough, congestion, and fatigue.",
        advice: "Rest, stay hydrated, and take fever-reducing medication if needed. Antiviral medications may be prescribed if caught early. If you experience difficulty breathing or persistent high fever, seek medical attention.",
        followUp: ["When did your symptoms start?", "Have you had a flu shot this season?", "Are you experiencing unusual fatigue?"]
    },
    "allergies": {
        response: "Allergies occur when your immune system reacts to a foreign substance. Common symptoms include sneezing, itching, runny nose, watery eyes, and sometimes wheezing.",
        advice: "Avoid known allergens, try over-the-counter antihistamines, and consider using a nasal spray. If symptoms are severe or affect breathing, consult a healthcare provider.",
        followUp: ["Do you know what triggers your allergies?", "Do your symptoms occur seasonally?", "Have you tried any allergy medications?"]
    },
    "rash": {
        response: "Skin rashes can be caused by allergic reactions, infections, heat, certain medications, or chronic skin conditions like eczema or psoriasis.",
        advice: "Avoid scratching, use mild soap, apply cool compresses, and try over-the-counter hydrocortisone cream. If the rash is widespread, painful, or accompanied by fever, seek medical attention.",
        followUp: ["Is the rash itchy?", "How long have you had the rash?", "Have you started any new medications recently?"]
    },
    "back pain": {
        response: "Back pain can result from muscle strain, poor posture, herniated discs, arthritis, or more serious conditions like kidney problems or spinal stenosis.",
        advice: "Rest (but not too much), apply ice or heat, use over-the-counter pain relievers, and practice good posture. If pain is severe, radiates down your legs, or is accompanied by numbness, seek medical attention.",
        followUp: ["Where exactly is the pain located?", "Did the pain start suddenly or gradually?", "Does the pain radiate to other areas?"]
    },
    "joint pain": {
        response: "Joint pain commonly results from inflammation, injury, arthritis, gout, or autoimmune conditions like rheumatoid arthritis or lupus.",
        advice: "Rest the affected joint, apply ice to reduce swelling, use over-the-counter anti-inflammatory medications, and consider gentle stretching. If pain is severe or persistent, please consult a healthcare provider.",
        followUp: ["Which joints are affected?", "Is there any swelling or redness?", "Does movement make the pain better or worse?"]
    },
    "dizziness": {
        response: "Dizziness can be caused by inner ear problems, low blood pressure, dehydration, medication side effects, or more serious conditions affecting the brain or heart.",
        advice: "Sit or lie down immediately when feeling dizzy, stay hydrated, avoid sudden movements, and ensure adequate rest. If dizziness is severe or recurrent, please seek medical evaluation.",
        followUp: ["Do you feel like the room is spinning?", "Have you experienced any hearing changes?", "Are you taking any medications?"]
    },
    "nausea": {
        response: "Nausea can be caused by digestive issues, food poisoning, motion sickness, pregnancy, migraines, or medication side effects.",
        advice: "Try eating small, bland meals, stay hydrated with clear liquids, avoid strong odors, and rest. If nausea persists over 24 hours or is accompanied by severe vomiting, seek medical attention.",
        followUp: ["Are you also experiencing vomiting?", "When did the nausea start?", "Have you eaten anything unusual recently?"]
    }
};

// Default responses when no specific disease is identified
const defaultResponses = [
    "I'm not quite sure I understand your health concern. Could you please provide more specific symptoms?",
    "To help you better, I need more details about your symptoms. What specific health issues are you experiencing?",
    "I want to provide accurate information. Could you describe your symptoms more clearly?",
    "For a better assessment, please share specific symptoms you're experiencing."
];

// Greeting messages
const greetings = [
    "Hello! I'm your Health Companion. I can help you understand potential causes for your symptoms and provide basic health information. What health concerns can I help you with today?",
    "Welcome to Health Companion! I'm here to provide information about your health concerns. Remember, I'm not a replacement for professional medical advice. How can I assist you today?"
];

// Add initial suggestions
function addSuggestions(suggestions) {
    quickSuggestions.innerHTML = '';
    suggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.classList.add('suggestion-chip');
        chip.textContent = suggestion;
        chip.addEventListener('click', () => {
            userInput.value = suggestion;
            sendMessage();
        });
        quickSuggestions.appendChild(chip);
    });
}

// Function to show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// Add a message to the chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    // Create avatar container
    const avatarContainer = document.createElement('div');
    avatarContainer.classList.add('avatar-container');
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    
    // Set avatar icon based on user or bot
    if (isUser) {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    avatarContainer.appendChild(avatar);
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = text;
    
    // Assemble message
    messageDiv.appendChild(avatarContainer);
    messageDiv.appendChild(messageContent);
    
    // Insert before the typing indicator
    chatMessages.insertBefore(messageDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send a message
function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;
    
    // Add user message
    addMessage(text, true);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process the message after a delay to simulate thinking
    setTimeout(() => {
        processUserInput(text);
        hideTypingIndicator();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Store conversation history
let conversationHistory = [];
let currentContext = null;

// Process user input and generate response
function processUserInput(text) {
    // Store in conversation history
    conversationHistory.push({
        role: 'user',
        content: text
    });
    
    // Check for greeting or help request
    if (firstMessage) {
        firstMessage = false;
        // Add suggestions but CONTINUE processing the message
        addSuggestions(initialSuggestions);
        // Remove the return statement so it continues processing!
        // return;  <- This is causing the issue
    }
    
    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Check if it's a follow-up question for current context
    if (currentContext) {
        const matchingFollowUp = currentContext.followUp.find(q => 
            q.toLowerCase() === lowerText || 
            text === q // Also check exact match for button clicks
        );
        
        if (matchingFollowUp) {
            handleFollowUp(matchingFollowUp);
            return;
        }
    }
    
    // Check for information about the chatbot
    if (lowerText.includes("yourself") || lowerText.includes("about you") || 
        lowerText.includes("who are you") || lowerText.includes("what are you") ||
        lowerText === "tell me about yourself") {
        const response = "I'm Health Companion, an AI chatbot designed to provide basic health information and guidance. I can help identify possible causes for symptoms and offer general health advice. Remember, I'm not a substitute for professional medical advice.";
        addMessage(response, false);
        conversationHistory.push({
            role: 'bot',
            content: response
        });
        addSuggestions(initialSuggestions);
        currentContext = null;
        return;
    }
    
    // Check for how it works
    if (lowerText.includes("how does this work") || lowerText.includes("how do you work") || 
        lowerText.includes("what can you help with") || lowerText.includes("what can you do") ||
        lowerText === "how does this work?" || lowerText === "what can you help with?") {
        const response = "I work by analyzing the symptoms you describe and matching them with common health conditions in my database. Simply tell me what symptoms you're experiencing, and I'll provide information about possible causes and basic advice. Remember to consult a healthcare professional for proper diagnosis and treatment.";
        addMessage(response, false);
        conversationHistory.push({
            role: 'bot',
            content: response
        });
        addSuggestions(initialSuggestions);
        currentContext = null;
        return;
    }
    
    // Check for disease keywords
    let foundDisease = null;
    let diseaseKey = null;
    
    for (const [key, data] of Object.entries(diseaseDatabase)) {
        if (lowerText.includes(key)) {
            foundDisease = data;
            diseaseKey = key;
            break;
        }
    }
    
    if (foundDisease) {
        // Send the disease information
        addMessage(foundDisease.response, false);
        conversationHistory.push({
            role: 'bot',
            content: foundDisease.response
        });
        
        // Add a delay before sending advice
        setTimeout(() => {
            addMessage(foundDisease.advice, false);
            conversationHistory.push({
                role: 'bot',
                content: foundDisease.advice
            });
            
            // Add follow-up suggestions
            addSuggestions(foundDisease.followUp);
            
            // Set current context to track follow-up questions
            currentContext = {
                disease: diseaseKey,
                followUp: foundDisease.followUp
            };
        }, 1000);
    } else {
        // Send a default response if no disease is identified
        const randomDefault = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        addMessage(randomDefault, false);
        conversationHistory.push({
            role: 'bot',
            content: randomDefault
        });
        
        // Keep the initial suggestions
        addSuggestions(initialSuggestions);
        currentContext = null;
    }
}

// Handle follow-up questions
function handleFollowUp(text) {
    // Generic follow-up responses based on question type
    const followUpResponses = {
        "Is your headache on one side?": "Headaches on one side may indicate a migraine. Migraines often cause intense, throbbing pain and can be accompanied by sensitivity to light and sound. If this is recurring, you may want to keep a headache diary to identify triggers.",
        
        "Do you have any visual disturbances?": "Visual disturbances like flashing lights, blind spots, or zigzag patterns before a headache could indicate a migraine with aura. This is caused by temporary changes in nerve activity in your visual cortex.",
        
        "How long have you had this headache?": "The duration of headaches can help identify the type. Tension headaches may last hours to days, migraines typically 4-72 hours, and cluster headaches about 15-180 minutes. Headaches lasting more than 72 hours should be evaluated by a doctor.",
        
        "Do you have any other symptoms?": "Additional symptoms can help narrow down the cause of your condition. Symptoms like fever, chills, or body aches often indicate an infection, while nausea or sensitivity to light may suggest a migraine.",
        
        "How high is your temperature?": "A temperature of 100.4°F (38°C) or higher is considered a fever. Low-grade fevers (below 102°F) are usually not concerning, but temperatures above 103°F (39.4°C) in adults or persistent fevers should be evaluated by a healthcare provider.",
        
        "When did the fever start?": "The duration of a fever can provide clues about its cause. Most viral illnesses cause fevers that last 2-3 days. Fevers lasting more than 3 days or that go away and return may require medical attention.",
        
        "Is your cough dry or productive?": "A dry cough doesn't produce mucus and may be caused by allergies, asthma, or viral infections. A productive cough brings up mucus or phlegm and may indicate bronchitis, pneumonia, or other respiratory infections.",
        
        "How long have you been coughing?": "Acute coughs typically last less than 3 weeks and are often due to colds or flu. Chronic coughs lasting more than 8 weeks may indicate asthma, allergies, GERD, or other conditions requiring medical evaluation.",
        
        "Where exactly is the pain located?": "The location of pain can help identify its cause. Upper abdominal pain may relate to the stomach or pancreas, lower right pain could indicate appendicitis, and general lower abdominal pain might suggest irritable bowel syndrome or menstrual cramps.",
        
        "Does the pain come and go or is it constant?": "Intermittent pain often indicates conditions like gas, muscle cramps, or certain types of inflammation. Constant pain may suggest more serious issues like appendicitis, kidney stones, or ulcers, especially if severe or worsening.",
        
        "Have you experienced nausea or vomiting?": "Nausea and vomiting alongside stomach pain may indicate gastroenteritis (stomach flu), food poisoning, or more serious conditions like appendicitis or bowel obstruction if accompanied by severe pain.",
        
        "Do you have a fever?": "Fever with symptoms indicates your body is fighting an infection. With a sore throat, it may suggest strep throat or tonsillitis. With stomach pain, it could indicate appendicitis or a stomach virus.",
        
        "Can you see white patches on your tonsils?": "White patches on tonsils often indicate strep throat or tonsillitis, which may require antibiotics. This can be accompanied by difficulty swallowing, fever, and swollen lymph nodes in the neck.",
        
        "How long have you had the sore throat?": "Viral sore throats typically improve within 5-7 days. If your sore throat lasts longer than a week, is severely painful, or makes it difficult to swallow or breathe, you should see a healthcare provider.",
        
        "How long have you had these symptoms?": "The duration of symptoms helps determine if you're dealing with an acute or chronic condition. Most colds last 7-10 days. Symptoms persisting beyond two weeks may indicate allergies or a secondary infection.",
        
        "Have you been exposed to anyone who is sick?": "Recent exposure to sick individuals increases the likelihood that you've caught the same illness, especially for contagious conditions like colds, flu, COVID-19, or stomach viruses. This information helps narrow down potential causes.",
        
        "When did your symptoms start?": "The timeline of symptom development can help identify the cause. Sudden onset may indicate infections, while gradual development might suggest allergies or chronic conditions.",
        
        "Have you had a flu shot this season?": "Having a flu shot reduces your chances of getting influenza, though it's still possible to get the flu or other viral illnesses with similar symptoms. The flu vaccine is typically 40-60% effective at preventing illness.",
        
        "Are you experiencing unusual fatigue?": "Extreme fatigue is common with viral infections like the flu or COVID-19. When accompanied by other symptoms, it suggests your body is using energy to fight infection and signals the need for rest.",
        
        "Do you know what triggers your allergies?": "Common allergy triggers include pollen, dust mites, pet dander, mold, and certain foods. Identifying your specific triggers can help you avoid them and reduce allergic reactions.",
        
        "Do your symptoms occur seasonally?": "Seasonal symptoms often indicate allergies to environmental factors like tree pollen (spring), grass pollen (summer), or ragweed (fall). Year-round symptoms may suggest allergies to indoor allergens like dust mites or pet dander.",
        
        "Have you tried any allergy medications?": "Over-the-counter antihistamines, nasal sprays, and eye drops can help manage allergy symptoms. If these don't provide relief, prescription medications or immunotherapy (allergy shots) might be recommended by an allergist.",
        
        "Is the rash itchy?": "Itchy rashes are often associated with allergic reactions, eczema, or insect bites. Rashes that don't itch may indicate other conditions like psoriasis, rosacea, or certain infections.",
        
        "How long have you had the rash?": "Acute rashes developing within hours or days often indicate allergic reactions or infections. Chronic rashes lasting weeks or months may suggest conditions like eczema, psoriasis, or autoimmune disorders.",
        
        "Have you started any new medications recently?": "New medications can cause skin reactions as a side effect. These typically appear within days to weeks of starting the medication. If you suspect a medication-related rash, consult with your healthcare provider before stopping any prescribed medications.",
        
        "Did the pain start suddenly or gradually?": "Sudden, severe pain may indicate acute injuries or conditions requiring immediate attention. Gradually developing pain often suggests chronic conditions, overuse injuries, or degenerative processes.",
        
        "Does the pain radiate to other areas?": "Radiating pain travels from its source to other body regions. Back pain radiating down the leg may indicate sciatica, while pain radiating from the chest to the arm, neck, or jaw could signal a heart attack.",
        
        "Which joints are affected?": "The pattern of joint involvement helps identify the cause. Symmetric joint pain (same joints on both sides) suggests rheumatoid arthritis, while pain in weight-bearing joints may indicate osteoarthritis. Gout typically affects a single joint, often the big toe.",
        
        "Is there any swelling or redness?": "Swelling, redness, and warmth around a joint indicate inflammation, which may be due to infection, arthritis, or injury. Severe or spreading redness with warmth requires prompt medical attention.",
        
        "Does movement make the pain better or worse?": "Pain that improves with movement may indicate inflammatory conditions like ankylosing spondylitis. Pain worsening with movement often suggests mechanical issues or injuries. Pain unaffected by movement may have systemic causes.",
        
        "Do you feel like the room is spinning?": "The sensation of the room spinning (vertigo) often indicates inner ear problems like benign paroxysmal positional vertigo, vestibular neuritis, or Meniere's disease. This differs from lightheadedness, which feels like you might faint.",
        
        "Have you experienced any hearing changes?": "Changes in hearing alongside dizziness suggest inner ear conditions. Sudden hearing loss with dizziness requires urgent medical evaluation, as it could indicate a treatable condition if addressed quickly.",
        
        "Are you taking any medications?": "Many medications can cause dizziness as a side effect, including blood pressure medications, antidepressants, anti-seizure drugs, sedatives, and certain antibiotics. Review your medications with your healthcare provider.",
        
        "Are you also experiencing vomiting?": "Nausea with vomiting may indicate gastroenteritis, food poisoning, migraines, or pregnancy. Severe, persistent vomiting or vomiting blood requires immediate medical attention.",
        
        "When did the nausea start?": "Sudden nausea may indicate food poisoning, motion sickness, or acute infection. Chronic or recurring nausea might suggest digestive disorders, pregnancy, or medication side effects.",
        
        "Have you eaten anything unusual recently?": "Food poisoning typically develops within hours of consuming contaminated food. Common culprits include undercooked meat, unpasteurized dairy, or food left at room temperature too long."
    };
    
    if (followUpResponses[text]) {
        // Send the follow-up response
        addMessage(followUpResponses[text], false);
        conversationHistory.push({
            role: 'bot',
            content: followUpResponses[text]
        });
        
        // Keep the same follow-up suggestions
        if (currentContext) {
            addSuggestions(currentContext.followUp);
        } else {
            addSuggestions(initialSuggestions);
        }
    } else {
        // Fallback response
        addMessage("I understand you're asking about " + text.toLowerCase() + ". Could you provide more details about your symptoms?", false);
        conversationHistory.push({
            role: 'bot',
            content: "I understand you're asking about " + text.toLowerCase() + ". Could you provide more details about your symptoms?"
        });
        
        // Reset to initial suggestions
        addSuggestions(initialSuggestions);
        currentContext = null;
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Start conversation with a greeting
let firstMessage = true;
window.addEventListener('load', () => {
    // Show typing indicator
    showTypingIndicator();
    
    // Send greeting after a delay
    setTimeout(() => {
        hideTypingIndicator();
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        addMessage(greeting, false);
        conversationHistory.push({
            role: 'bot',
            content: greeting
        });
        // Jump straight to symptom suggestions instead of welcome buttons
        addSuggestions(initialSuggestions);
    }, 1500);
});

// Add text-to-speech capabilities
const speechButton = document.createElement('button');
speechButton.innerHTML = '<i class="fas fa-volume-up"></i>';
speechButton.className = 'speech-button';
document.querySelector('.header-buttons').appendChild(speechButton);

// Add reset button to header
const resetButton = document.createElement('button');
resetButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
resetButton.className = 'reset-button';
document.querySelector('.header-buttons').appendChild(resetButton);

// Reset chat function
function resetChat() {
    // Clear chat messages
    while (chatMessages.firstChild) {
        if (chatMessages.firstChild !== typingIndicator) {
            chatMessages.removeChild(chatMessages.firstChild);
        } else {
            break;
        }
    }
    
    // Reset conversation history
    conversationHistory = [];
    
    // Reset firstMessage flag
    firstMessage = true;
    
    // Reset current context
    currentContext = null;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send greeting after a delay
    setTimeout(() => {
        hideTypingIndicator();
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        addMessage(greeting, false);
        conversationHistory.push({
            role: 'bot',
            content: greeting
        });
        // Jump straight to symptom suggestions instead of welcome buttons
        addSuggestions(initialSuggestions);
    }, 1500);
}

// Add event listener to reset button
resetButton.addEventListener('click', resetChat);

let isSpeechEnabled = false;
speechButton.addEventListener('click', () => {
    isSpeechEnabled = !isSpeechEnabled;
    if (isSpeechEnabled) {
        speechButton.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        speechSynthesis.cancel(); // Cancel any ongoing speech
        speak("Text to speech is now enabled");
    } else {
        speechButton.style.color = 'white';
        speechSynthesis.cancel(); // Cancel any ongoing speech
    }
});

// Function to speak text
function speak(text) {
    if (!isSpeechEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
}

// Modify addMessage to use speech synthesis for bot messages
const originalAddMessage = addMessage;
addMessage = function(text, isUser) {
    originalAddMessage(text, isUser);
    if (!isUser && isSpeechEnabled) {
        speak(text);
    }
};
