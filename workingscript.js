// Get required DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to add a message to the chat window
function addMessage(content, sender) {
  const messageContainer = document.createElement('div');
  const message = document.createElement('p');
  message.textContent = content;
  messageContainer.appendChild(message);
  messageContainer.classList.add('message', sender);
  chatMessages.appendChild(messageContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle user input and generate response
async function handleUserInput() {
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    addMessage(userMessage, 'sent');

    // Clear the input field
    userInput.value = '';

    try {
      const response = await getChatBotResponse(userMessage);
      addMessage(response, 'received');
    } catch (error) {
      console.error('Failed to get response from Chat Bot:', error);
      addMessage('Oops! Something went wrong while fetching the response.', 'received');
    }
  }
}

// Function to make an API call and generate chat bot's response
async function getChatBotResponse(userMessage) {
  const chatPrompt = `You are an AI-powered chat bot designed for a small landscaping company. Your primary goal is to assist potential and existing customers with their inquiries, provide basic support, generate leads, and offer information about the company's services. You should be friendly, informative, and helpful in your responses. Here are some specific tasks you should be able to handle:

    [Respond to general inquiries]:
        Customer: "What services do you offer?"
        Bot: "We offer a range of services including mowing, landscaping, lawn fertilization, and more. How can I assist you with any specific service?"

    [Provide pricing estimates]:
        Customer: "How much does lawn mowing service cost?"
        Bot: "The cost of our lawn mowing service depends on factors such as lawn size, frequency of service, and additional requirements. To provide you with an estimate, could you please provide me with the approximate size of your lawn?"

    [Schedule appointments]:
        Customer: "I'd like to schedule a consultation. How can I do that?"
        Bot: "Certainly! I can help you with that. Please provide your preferred date and time for the consultation, and I'll check our availability."

    [Answer frequently asked questions]:
        Customer: "What types of payment methods do you accept?"
        Bot: "We accept various payment methods, including credit cards, cash, and online payment platforms. If you have a preferred method, we can accommodate it during our service."

    [Collect lead information]:
        Customer: "I'm interested in your landscaping services. Can you tell me more about it?"
        Bot: "Absolutely! Our landscaping services include design, installation, and maintenance. To better understand your needs and provide tailored recommendations, could you please provide some details about your project, such as the size of the area and any specific design preferences you may have?"

Remember, as a chat bot, you should strive to offer helpful and accurate information. If you encounter complex queries or requests beyond your capabilities, kindly let the customer know that a human representative will follow up to provide further assistance.

Rules you MUST follow:
1. Never ask a customer if a price is acceptable, reasonable, or anything else for them. Instead just give them the price.
2. ALWAYS give an estimate. Even if you don't have specifics yet from the customer, give an estimate based on what customers spend on average. If the customer is looking for lawn care service, give the customer an estimate based on what the average customer spends each month."
From here forward you will only function as the bot in the conversation and you will ALWAYS follow the two rules given to you.  
  `
  
  const apiKey = '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'; // Replace with your OpenAI API key

  const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: chatPrompt + '\n' + `Customer: ${userMessage}\nAssistant:`,
      max_tokens: 50, // Adjust the response length as needed
      temperature: 0.6 // Adjust the temperature for response randomness
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch API response');
  }

  const data = await response.json();
  return data.choices[0].text.trim();
}


// Event listener for send button click
sendButton.addEventListener('click', handleUserInput);

// Event listener for Enter key press in the input field
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleUserInput();
  }
});

// Get references to the chat toggle button and chat popup
const chatToggleButton = document.getElementById('chat-toggle');
const chatPopup = document.getElementById('chat-popup');

// Function to toggle the chat popup window
function toggleChatPopup() {
  chatPopup.classList.toggle('show');
}

// Function to close the chat popup window
function closeChatPopup() {
  chatPopup.classList.remove('show');
}

// Add event listeners to the chat toggle button and close button
chatToggleButton.addEventListener('click', toggleChatPopup);

const closeButton = document.createElement('button');
closeButton.innerHTML = 'Close';
closeButton.addEventListener('click', closeChatPopup);
chatPopup.appendChild(closeButton);