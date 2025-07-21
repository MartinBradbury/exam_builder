import React, { useContext } from "react";
import "../styles/Home.css";
import { UserContext } from "../context/UserContext";
import Carousel from "react-bootstrap/Carousel";
import bio from "../assets/home/alevelbio.jpg";
import chem from "../assets/home/alevelchem.jpg";
import physics from "../assets/home/alevelphysics.jpg";

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
              <a href="/question-generator" className="btn btn-primary">
                Get Started
              </a>
            ) : (
              <a href="/login" className="btn btn-secondary">
                Login
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ✅ New Carousel Section */}
      <section className="subject-carousel">
        <h2
          style={{
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "20px",
          }}
        >
          Explore Subjects
        </h2>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={bio} alt="Biology" />
              <Carousel.Caption className="carousel-caption-overlay">
                <h3>Biology</h3>
                <p>Dive into biological molecules, cells, and genetics.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img className="d-block w-100" src={chem} alt="Chemistry" />
              <Carousel.Caption className="carousel-caption-overlay">
                <h3>Chemistry</h3>
                <p>Explore chemical reactions and molecular structures.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img className="d-block w-100" src={physics} alt="Physics" />
              <Carousel.Caption className="carousel-caption-overlay">
                <h3>Physics</h3>
                <p>Understand forces, energy, and the laws of motion.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </section>

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
