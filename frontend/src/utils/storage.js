// Anti-abuse mechanism #2: Client-side vote tracking using localStorage
// This prevents the same browser from voting multiple times

const STORAGE_KEY = 'pollvault_votes';

export const storage = {
  // Check if user has voted in a specific poll
  hasVoted(pollId) {
    try {
      const votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return votes[pollId] === true;
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  },

  // Mark poll as voted
  markAsVoted(pollId) {
    try {
      const votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      votes[pollId] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch (error) {
      console.error('Error marking vote:', error);
    }
  },

  // Get vote timestamp (for future rate limiting features)
  getVoteTimestamp(pollId) {
    try {
      const votes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return votes[pollId];
    } catch (error) {
      return null;
    }
  },

  // Clear all votes (admin/testing only)
  clearAllVotes() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
