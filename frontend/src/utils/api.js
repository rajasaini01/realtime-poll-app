const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async createPoll(question, options) {
    const response = await fetch(`${API_BASE_URL}/api/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create poll');
    }

    return response.json();
  },

  async getPoll(pollId) {
    const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch poll');
    }

    return response.json();
  },

  async vote(pollId, optionId) {
    const response = await fetch(`${API_BASE_URL}/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ optionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit vote');
    }

    return response.json();
  },
};

export const SOCKET_URL = API_BASE_URL;
