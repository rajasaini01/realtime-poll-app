import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="hero">
          <div className="hero-badge animate-in">
            ⚡ Real-time results • Zero refresh needed
          </div>
          
          <h1 className="hero-title animate-in-delay">
            Create Polls That
            <br />
            <span className="gradient-text">Update Instantly</span>
          </h1>

          <p className="hero-description">
            Build shareable polls with live results. Perfect for teams, classrooms, events, and communities. No sign-up required.
          </p>

          <div className="hero-actions">
            <Link to="/create" className="btn-primary">
              Create Your First Poll
              <span className="btn-icon">→</span>
            </Link>
          </div>

          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div>
                <h3>Real-time Updates</h3>
                <p>See votes come in live</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div>
                <h3>Fair Voting</h3>
                <p>Built-in anti-abuse protection</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔗</div>
              <div>
                <h3>Easy Sharing</h3>
                <p>Share with one simple link</p>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create</h3>
              <p>Add your question and answer options</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Share</h3>
              <p>Copy the link and share it anywhere</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Watch</h3>
              <p>Results update in real-time as people vote</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
