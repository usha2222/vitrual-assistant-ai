import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

export const getMistralResponse = async (prompt) => {
  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error('Mistral AI returned an empty response.');
    }

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Mistral Service Error:', error.message);
    throw error;
  }
};
export default getMistralResponse;