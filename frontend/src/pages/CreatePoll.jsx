import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import './CreatePoll.css'

function CreatePoll() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!question.trim()) {
      setError('Please enter a question')
      return
    }

    const validOptions = options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options')
      return
    }

    setLoading(true)

    try {
      const result = await api.createPoll(question.trim(), validOptions)
      navigate(`/poll/${result.pollId}`)
    } catch (err) {
      setError(err.message || 'Failed to create poll')
      setLoading(false)
    }
  }

  return (
    <div className="create-poll">
      <div className="container">
        <div className="create-content">
          <div className="create-header">
            <h1 className="create-title">
              Create a <span className="gradient-text">New Poll</span>
            </h1>
            <p className="create-description">
              Ask a question, add options, and get instant feedback from your audience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="poll-form">
            <div className="form-group">
              <label htmlFor="question" className="form-label">
                Your Question
              </label>
              <input
                type="text"
                id="question"
                className="form-input"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={200}
                disabled={loading}
              />
              <div className="char-count">
                {question.length}/200
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Answer Options
                <span className="label-hint">(minimum 2 required)</span>
              </label>
              
              <div className="options-list">
                {options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <div className="option-number">{index + 1}</div>
                    <input
                      type="text"
                      className="form-input option-input"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      maxLength={100}
                      disabled={loading}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeOption(index)}
                        disabled={loading}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 10 && (
                <button
                  type="button"
                  className="btn-add-option"
                  onClick={addOption}
                  disabled={loading}
                >
                  + Add Another Option
                </button>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Creating Poll...
                </>
              ) : (
                <>
                  Create Poll
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>Fair Voting</h3>
              <p>Each person can vote once per poll using IP tracking and browser storage</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Live Results</h3>
              <p>Results update in real-time for all viewers without refreshing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePoll
