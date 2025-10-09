import axios from 'axios';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://clgai.app.n8n.cloud/webhook/fb2bcc3a-0d89-4e01-b21e-93aa3133a635/chat';
const USE_N8N = process.env.USE_N8N === 'true';

export const handleChatbotMessage = async (req, res) => {
  const { message } = req.body;

  console.log('Received chatbot request body:', req.body);
  console.log('Extracted message:', message);
  console.log('USE_N8N is set to:', USE_N8N);

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!USE_N8N) {
    console.log('USE_N8N is false, returning mock response');
    return res.json({ answer: `Mock response: Thank you for your message "${message}". The AI is currently in development.` });
  }

  const attemptRequest = async (retry = false) => {
    try {
      const payload = { message: message };
      console.log('Sending payload to n8n webhook:', payload);
      const response = await axios.post(N8N_WEBHOOK_URL, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Received response from n8n webhook:', response.data);
      return res.json({ answer: response.data.reply || response.data });
    } catch (error) {
      if (error.response && error.response.status === 500 && !retry) {
        console.warn('n8n webhook returned 500, retrying once...');
        return attemptRequest(true);
      }
      console.error('Error forwarding message to n8n webhook:', {
        message: error.message,
        status: error.response ? error.response.status : 'No status',
        data: error.response ? error.response.data : 'No data'
      });
      return res.json({ answer: `Mock response: Thank you for your message "${message}". The AI is currently unavailable.` });
    }
  };

  return attemptRequest();
};
