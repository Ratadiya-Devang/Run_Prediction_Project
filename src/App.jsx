import { useState } from "react";
import "./App.css";

const API_URL =
  "https://player-run-predictor.onrender.com/prediction";

function App() {
  const [matches, setMatches] = useState(["", "", "", "", ""]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input
  const handleChange = (index, value) => {
    // Allow only integers (0-9)
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }

    const updatedMatches = [...matches];
    updatedMatches[index] = value;

    setMatches(updatedMatches);

    // Clear old result/error
    setPrediction(null);
    setError("");
  };

  // Predict
  const handlePredict = async () => {
    setError("");
    setPrediction(null);

    // Validation
    if (matches.some((value) => value === "")) {
      setError("Please enter runs for all 5 matches.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          m1: Number(matches[0]),
          m2: Number(matches[1]),
          m3: Number(matches[2]),
          m4: Number(matches[3]),
          m5: Number(matches[4]),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // API response:
      // {"run": 61}

      if (typeof data.run !== "number") {
        throw new Error("Invalid prediction received from API.");
      }

      setPrediction(data.run);
    } catch (err) {
      console.error("Prediction Error:", err);

      setError(
        "Unable to get prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setMatches(["", "", "", "", ""]);
    setPrediction(null);
    setError("");
  };

  // Calculate average
  const average =
    matches.every((value) => value !== "")
      ? (
          matches.reduce(
            (sum, value) => sum + Number(value),
            0
          ) / 5
        ).toFixed(1)
      : null;

  return (
    <div className="app">

      {/* Background decoration */}
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="grid-background"></div>

      <main className="main-container">

        {/* ================= HEADER ================= */}

        <header className="top-header">

          <div className="brand">

            <div className="brand-icon">
              🏏
            </div>

            <div>
              <div className="brand-name">
                RUN<span>CAST</span>
              </div>

              <div className="brand-subtitle">
                PLAYER PERFORMANCE INTELLIGENCE
              </div>
            </div>

          </div>

          <div className="live-indicator">
            <span className="live-dot"></span>
            AI MODEL ONLINE
          </div>

        </header>


        {/* ================= HERO ================= */}

        <section className="hero">

          <div className="hero-text">

            <div className="eyebrow">
              <span></span>
              MACHINE LEARNING PREDICTION
            </div>

            <h1>
              Predict the next
              <br />

              <span className="gradient-text">
                match performance.
              </span>
            </h1>

            <p>
              Enter the player's last five match scores
              and let our machine learning model estimate
              the next performance.
            </p>

          </div>

          <div className="hero-stat">

            <div className="stat-circle">

              <span className="stat-number">
                5
              </span>

              <span className="stat-label">
                MATCHES
              </span>

            </div>

          </div>

        </section>


        {/* ================= MAIN PANEL ================= */}

        <section className="prediction-panel">

          <div className="panel-heading">

            <div>

              <div className="section-number">
                01
              </div>

              <h2>
                Recent performance
              </h2>

              <p>
                Enter runs scored in the last 5 matches.
              </p>

            </div>

            <div className="secure-label">
              <span>●</span>
              MODEL READY
            </div>

          </div>


          {/* ================= MATCH INPUTS ================= */}

          <div className="match-grid">

            {matches.map((value, index) => (

              <div
                className={`match-input ${
                  value !== "" ? "filled" : ""
                }`}
                key={index}
              >

                <div className="match-top">

                  <span className="match-number">
                    0{index + 1}
                  </span>

                  <span className="match-label">
                    MATCH
                  </span>

                </div>

                <div className="input-container">

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value}
                    placeholder="00"
                    onChange={(e) =>
                      handleChange(
                        index,
                        e.target.value
                      )
                    }
                    aria-label={`Match ${
                      index + 1
                    } runs`}
                  />

                  <span className="runs-label">
                    RUNS
                  </span>

                </div>

                <div className="input-line"></div>

              </div>

            ))}

          </div>


          {/* ================= QUICK STATS ================= */}

          <div className="quick-stats">

            <div className="quick-stat">

              <span className="quick-label">
                MATCHES ENTERED
              </span>

              <strong>
                {matches.filter(
                  (value) => value !== ""
                ).length}
                <small>/5</small>
              </strong>

            </div>

            <div className="quick-divider"></div>

            <div className="quick-stat">

              <span className="quick-label">
                RECENT AVERAGE
              </span>

              <strong>
                {average ?? "--"}
              </strong>

            </div>

            <div className="quick-divider"></div>

            <div className="quick-stat">

              <span className="quick-label">
                INPUT TYPE
              </span>

              <strong className="integer-text">
                INTEGER
              </strong>

            </div>

          </div>


          {/* ================= ERROR ================= */}

          {error && (

            <div className="error-box">

              <div className="error-icon">
                !
              </div>

              <div>
                <strong>
                  Prediction unavailable
                </strong>

                <p>
                  {error}
                </p>
              </div>

            </div>

          )}


          {/* ================= ACTIONS ================= */}

          <div className="actions">

            <button
              className="predict-button"
              onClick={handlePredict}
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="loader"></span>
                  ANALYZING PERFORMANCE...
                </>

              ) : (

                <>
                  PREDICT NEXT MATCH
                  <span className="button-arrow">
                    →
                  </span>
                </>

              )}

            </button>


            <button
              className="reset-button"
              onClick={handleReset}
              disabled={loading}
            >
              RESET
            </button>

          </div>

        </section>


        {/* ================= RESULT ================= */}

        {prediction !== null && (

          <section className="result-section">

            <div className="result-header">

              <div>

                <div className="section-number">
                  02
                </div>

                <h2>
                  Prediction complete
                </h2>

              </div>

              <div className="prediction-status">
                <span></span>
                PREDICTION GENERATED
              </div>

            </div>


            <div className="result-content">

              <div className="result-main">

                <div className="result-caption">
                  EXPECTED NEXT MATCH RUNS
                </div>

                <div className="result-number">
                  {prediction}
                </div>

                <div className="result-runs">
                  RUNS
                </div>

              </div>


              <div className="result-side">

                <div className="result-icon">
                  🏏
                </div>

                <p>
                  Based on the player's
                  recent 5-match performance,
                  the model predicts:
                </p>

                <strong>
                  {prediction} runs
                </strong>

              </div>

            </div>


            {/* Previous scores */}

            <div className="previous-performance">

              <div className="previous-title">
                RECENT PERFORMANCE
              </div>

              <div className="score-bars">

                {matches.map((value, index) => {

                  const score =
                    Number(value);

                  const maxScore =
                    Math.max(
                      ...matches.map(
                        (item) =>
                          Number(item || 0)
                      ),
                      1
                    );

                  const height =
                    Math.max(
                      (score / maxScore) * 100,
                      8
                    );

                  return (

                    <div
                      className="bar-wrapper"
                      key={index}
                    >

                      <div className="bar-value">
                        {score}
                      </div>

                      <div className="bar-track">

                        <div
                          className="bar-fill"
                          style={{
                            height: `${height}%`,
                          }}
                        ></div>

                      </div>

                      <span>
                        M{index + 1}
                      </span>

                    </div>

                  );

                })}

              </div>

            </div>

          </section>

        )}


        {/* ================= FOOTER ================= */}

        <footer>

          <div className="footer-line"></div>

          <div className="footer-content">

            <span>
              RUNCAST
            </span>

            <span>
              MACHINE LEARNING PROJECT
            </span>

            <span>
              FASTAPI × REACT
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default App;