async function makeOpenAIRequest(query) {
  const apiKey = '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'; // Replace with your OpenAI API key

  const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: query,
      max_tokens: 100, // Adjust the response length as needed
      temperature: 0.6 // Adjust the temperature for response randomness
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch API response');
  }

  const data = await response.json();
  return data.choices[0].text.trim();
}

// Example usage
async function exampleUsage() {
  try {
    const query = 'What is the capital of France?';
    const response = await makeOpenAIRequest(query);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

exampleUsage();