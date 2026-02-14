import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { api, SOCKET_URL } from '../utils/api'
import { storage } from '../utils/storage'
import './PollView.css'

function PollView() {
  const { pollId } = useParams()
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [voting, setVoting] = useState(false)
  const [socket, setSocket] = useState(null)
  const [shareSuccess, setShareSuccess] = useState(false)

  useEffect(() => {
    loadPoll()
    
    // Check localStorage for previous vote
    if (storage.hasVoted(pollId)) {
      setHasVoted(true)
    }

    // Setup Socket.io for real-time updates
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to server')
      newSocket.emit('join-poll', pollId)
    })

    newSocket.on('vote-update', (data) => {
      console.log('Received vote update:', data)
      setPoll(data.poll)
    })

    return () => {
      newSocket.emit('leave-poll', pollId)
      newSocket.close()
    }
  }, [pollId])

  const loadPoll = async () => {
    try {
      setLoading(true)
      const data = await api.getPoll(pollId)
      setPoll(data.poll)
      
      // Server also checks IP-based voting
      if (data.hasVoted) {
        setHasVoted(true)
      }
      
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load poll')
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!selectedOption || voting || hasVoted) return

    setVoting(true)
    setError('')

    try {
      const result = await api.vote(pollId, selectedOption)
      setPoll(result.poll)
      setHasVoted(true)
      
      // Anti-abuse mechanism #2: Mark as voted in localStorage
      storage.markAsVoted(pollId)
    } catch (err) {
      if (err.message.includes('already voted')) {
        setHasVoted(true)
        storage.markAsVoted(pollId)
      }
      setError(err.message || 'Failed to submit vote')
    } finally {
      setVoting(false)
    }
  }

  const copyShareLink = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    })
  }

  const getPercentage = (votes) => {
    if (!poll || poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  const getBarColor = (index) => {
    const colors = [
      'var(--color-primary)',
      'var(--color-secondary)',
      'var(--color-accent)',
      'var(--color-success)',
      'var(--color-warning)',
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="poll-view">
        <div className="container">
          <div className="loading-state">
            <div className="loading"></div>
            <p>Loading poll...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !poll) {
    return (
      <div className="poll-view">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Poll Not Found</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="poll-view">
      <div className="container">
        <div className="poll-content">
          <div className="poll-header">
            <h1 className="poll-question">{poll.question}</h1>
            
            <div className="poll-meta">
              <div className="vote-count">
                <span className="count-number">{poll.totalVotes}</span>
                <span className="count-label">
                  {poll.totalVotes === 1 ? 'vote' : 'votes'}
                </span>
              </div>
              
              <button 
                className={`btn-share ${shareSuccess ? 'success' : ''}`}
                onClick={copyShareLink}
              >
                {shareSuccess ? '✓ Copied!' : '🔗 Share'}
              </button>
            </div>
          </div>

          {!hasVoted ? (
            <div className="voting-section">
              <p className="voting-instruction">Select an option to vote:</p>
              
              <div className="options-grid">
                {poll.options.map((option, index) => (
                  <button
                    key={option.id}
                    className={`option-card ${selectedOption === option.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(option.id)}
                    disabled={voting}
                  >
                    <div className="option-radio">
                      {selectedOption === option.id && <div className="radio-dot"></div>}
                    </div>
                    <div className="option-text">{option.text}</div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                className="btn-vote"
                onClick={handleVote}
                disabled={!selectedOption || voting}
              >
                {voting ? (
                  <>
                    <span className="loading"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Vote
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="results-section">
              <div className="results-header">
                <div className="live-indicator">
                  <span className="pulse-dot"></span>
                  Live Results
                </div>
                <p className="results-description">
                  Updates automatically as new votes come in
                </p>
              </div>

              <div className="results-list">
                {poll.options.map((option, index) => {
                  const percentage = getPercentage(option.votes)
                  const isLeading = option.votes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes))
                  
                  return (
                    <div 
                      key={option.id} 
                      className={`result-item ${isLeading ? 'leading' : ''}`}
                    >
                      <div className="result-header">
                        <div className="result-label">
                          {option.text}
                          {isLeading && poll.totalVotes > 0 && (
                            <span className="leading-badge">👑 Leading</span>
                          )}
                        </div>
                        <div className="result-stats">
                          <span className="result-percentage">{percentage}%</span>
                          <span className="result-votes">
                            {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                          </span>
                        </div>
                      </div>
                      <div className="result-bar">
                        <div 
                          className="result-fill"
                          style={{
                            width: `${percentage}%`,
                            background: getBarColor(index)
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="voted-notice">
                <span className="notice-icon">✓</span>
                You've already voted in this poll
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PollView
