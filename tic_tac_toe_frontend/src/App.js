import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Square component - represents a single cell of the board
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /**
   * This is a public function: Square displays X or O and handles click events.
   */
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell contains ${value}` : "Empty cell"}
      tabIndex={0}
      disabled={!!value}
    >
      {value}
    </button>
  );
}

/**
 * Board component - renders the 3x3 grid and passes player/click handling
 */
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /**
   * This is a public function: Board shows a 3x3 game grid.
   */
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onSquareClick(i)}
      highlight={winningLine?.includes(i)}
    />
  );
  return (
    <div className="ttt-board">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row}>
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

/**
 * Game status and actions panel (status, reset button)
 */
// PUBLIC_INTERFACE
function GameStatus({ status, onReset }) {
  /**
   * Shows game state (turn, win, draw) and reset button.
   */
  return (
    <div className="ttt-status-bar">
      <span className="ttt-status">{status}</span>
      <button className="ttt-reset-btn" onClick={onReset} aria-label="Reset game">
        Restart Game
      </button>
    </div>
  );
}

/**
 * Compute the winner and winning line from current board state.
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Returns {winner: "X"|"O"|null, line: [number,number,number]|null}
   */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * Themed toggle button for (optional) dark/light mode (minimalistic requirement)
 */
// PUBLIC_INTERFACE
function ThemeToggle({ theme, setTheme }) {
  /**
   * Button to toggle light/dark theme.
   */
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component for the Tic Tac Toe game.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [winningLine, setWinningLine] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Accessibility: Update theme CSS variable
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Update game status after every move
    const { winner, line } = calculateWinner(squares);
    setWinningLine(line);
    if (winner) {
      setStatus(`Winner: ${winner} 🎉`);
    } else if (squares.every(Boolean)) {
      setStatus("Draw! 🤝");
    } else {
      setStatus(`Current turn: ${xIsNext ? "X" : "O"}`);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    // If filled or game won already, ignore
    if (squares[i] || winningLine) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
  };

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title" style={{ color: "var(--primary-color)" }}>
          Tic Tac Toe
        </h1>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <main className="ttt-main">
        <GameStatus status={status} onReset={handleReset} />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
      </main>
      <footer className="ttt-footer">
        <span>
          <strong>Built with React</strong> &ndash; Minimalistic Tic Tac Toe Game
        </span>
      </footer>
    </div>
  );
}

export default App;
