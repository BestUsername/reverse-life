import React, { useState } from 'react';
    import './index.css';

    const GRID_SIZE = 20;

    function createEmptyGrid() {
      return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    }

    function GameOfLife() {
      const [grid, setGrid] = useState(createEmptyGrid());
      const [history, setHistory] = useState([createEmptyGrid()]);
      const [stepNumber, setStepNumber] = useState(0);

      const calculateNextGrid = (currentGrid) => {
        const newGrid = currentGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRowIndex = rowIndex + i;
                const newColIndex = colIndex + j;
                if (
                  newRowIndex >= 0 &&
                  newRowIndex < GRID_SIZE &&
                  newColIndex >= 0 &&
                  newColIndex < GRID_SIZE
                ) {
                  neighbors += currentGrid[newRowIndex][newColIndex];
                }
              }
            }

            if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
            if (cell === 0 && neighbors === 3) return 1;
            return cell;
          })
        );

        setHistory((prevHistory) => [...prevHistory.slice(0, stepNumber + 1), newGrid]);
        setStepNumber(stepNumber + 1);
        setGrid(newGrid);
      };

      const calculatePreviousGrid = (currentGrid) => {
        // This is a naive approach to generate a possible previous state
        const newGrid = currentGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRowIndex = rowIndex + i;
                const newColIndex = colIndex + j;
                if (
                  newRowIndex >= 0 &&
                  newRowIndex < GRID_SIZE &&
                  newColIndex >= 0 &&
                  newColIndex < GRID_SIZE
                ) {
                  neighbors += currentGrid[newRowIndex][newColIndex];
                }
              }
            }

            // Naive logic to determine possible previous state
            if (cell === 1) {
              return [2, 3].includes(neighbors) ? 1 : 0;
            } else {
              return neighbors === 3 ? 1 : 0;
            }
          })
        );

        setHistory((prevHistory) => [...prevHistory.slice(0, stepNumber), newGrid]);
        setStepNumber(stepNumber - 1);
        setGrid(newGrid);
      };

      const handleCellClick = (rowIndex, colIndex) => {
        const newGrid = grid.map((row, rIndex) =>
          row.map((cell, cIndex) => (rIndex === rowIndex && cIndex === colIndex ? !cell : cell))
        );

        setHistory((prevHistory) => [...prevHistory.slice(0, stepNumber + 1), newGrid]);
        setStepNumber(stepNumber + 1);
        setGrid(newGrid);
      };

      const jumpTo = (step) => {
        setGrid(history[step]);
        setStepNumber(step);
      };

      return (
        <div>
          <h1>Conway's Game of Life</h1>
          <button onClick={() => calculateNextGrid(grid)}>Next Step</button>
          <button onClick={() => stepNumber > 0 && calculatePreviousGrid(history[stepNumber - 1])} disabled={stepNumber === 0}>
            Previous Step
          </button>
          <div className="grid">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell ? 'alive' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                />
              ))
            )}
          </div>
          <div className="history-container">
            <div className="history">
              {history.map((_, step) => (
                <button
                  key={step}
                  onClick={() => jumpTo(step)}
                  disabled={step === stepNumber}
                >
                  Step {step}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    export default GameOfLife;
