import React, { useContext } from "react";
import "../styles/Home.css";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="homepage">
      <header className="hero">
        <div className="hero-content">
          <h1>A‑Level Biology Exam Question Generator</h1>
          <p>
            Generate custom exam questions, practice answering them, and get
            instant feedback to boost your grades.
          </p>
          <div className="hero-buttons">
            {user ? (
              // ✅ show Get Started if logged in
              <a href="/question-generator" className="btn btn-primary">
                Get Started
              </a>
            ) : (
              // ✅ show Login if not logged in
              <a href="/login" className="btn btn-secondary">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="features">
        <h2>Why Choose My Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🧬 Topic‑Specific Questions</h3>
            <p>
              Select from A‑Level Biology topics like Biological Molecules,
              Cells, Genetics, and more.
            </p>
          </div>
          <div className="feature-card">
            <h3>✏️ Instant Feedback</h3>
            <p>
              Get detailed feedback on each answer, helping you understand your
              strengths and weaknesses.
            </p>
          </div>
          <div className="feature-card">
            <h3>📈 Track Your Progress</h3>
            <p>
              Save your results, revisit past questions, and see your
              improvement over time.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} A‑Level Bio Questions. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
