// Get required DOM elements
const chatMessagesContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Array to store the chat messages
const chatMessages = [];

// Chat prompt
const chatPrompt = `You are an AI-powered chat bot designed for a small landscaping company. Your primary goal is to assist potential and existing customers with their inquiries, provide basic support, generate leads, and offer information about the company's services. You should be friendly, informative, and helpful in your responses.

Here are some specific tasks you should be able to handle:

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
1. Never ask a customer if a price is acceptable, reasonable, or anything else for them. Instead, just give them the price.
2. ALWAYS give an estimate. Even if you don't have specifics yet from the customer, give an estimate based on what customers spend on average. If the customer is looking for lawn care service, give the customer an estimate based on what the average customer spends each month."

From here forward, you will only function as the bot in the conversation, and you will ALWAYS follow the two rules given to you.

The following is the conversation you've had so far with the customer.`;

// Function to display a message in the chat popup
function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerHTML = `<p>${message}</p>`;
  chatMessagesContainer.appendChild(messageElement);
}

// Function to send user message and get response
async function sendMessage() {
  const userMessage = userInput.value;

  if (userMessage.trim() === '') {
    return;
  }

  // Display user message
  displayMessage(userMessage, 'sent');

  // Add user message to chat messages array
  chatMessages.push({
    role: 'user',
    content: userMessage
  });

  // Call OpenAI API to get response
  const response = await getChatbotResponse();

  // Extract and display chatbot response
  let chatbotMessage = 'Oops! Something went wrong. Please try again.';
  if (response && response.role === 'assistant' && response.content) {
    chatbotMessage = response.content;
    displayMessage(chatbotMessage, 'received');
  }

  // Add chatbot response to chat messages array
  chatMessages.push({
    role: 'assistant',
    content: chatbotMessage
  });

  // Clear the user input field
  userInput.value = '';
}


// Function to get response from OpenAI API
async function getChatbotResponse() {
  const apiKey = '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'; // Replace with your OpenAI API key

  // Prepare messages array with chat prompt and previous conversation
  const messages = [
    {
      role: 'system',
      content: chatPrompt
    },
    ...chatMessages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      temperature: 0.6
    })
  });


  try {
    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message;
    } else {
      throw new Error('No response from the API');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Event listener for sending a message
sendButton.addEventListener('click', sendMessage);

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
