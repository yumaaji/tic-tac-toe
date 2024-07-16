import React, { useState } from 'react';

// Komponen Square: Merender sebuah tombol kotak tunggal
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Komponen Board: Merender papan permainan Tic-Tac-Toe dan mengelola logika permainan
function Board({ xIsNext, squares, onPlay, onReset }) {

  // Fungsi handleClick: Menangani event klik pada kotak
  function handleClick(i) {
    // Jika kotak sudah terisi atau ada pemenang, fungsi berhenti
    if (squares[i] || calculateWinner(squares)) return;

    // Membuat salinan dari array squares dan memperbarui nilai kotak yang diklik
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    // Memanggil fungsi onPlay dengan array squares yang diperbarui
    onPlay(nextSquares);
  }

  // Mengecek apakah ada pemenang
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner; // Mengecek apakah permainan seri
  let status = '';
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      {/* Menampilkan status pemenang dan tombol untuk kembali ke awal permainan */}
      <div className="status">{status}</div>
      <div className="board">
        {/* Memanggil fungsi Square untuk setiap kotak pada papan permainan */}
        {squares.map((square, i) => (
          <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      {(winner || isDraw) && (
        <button onClick={onReset} className="reset-button">Play Again</button>
      )}
    </>
  );
}

// Komponen Game: Mengelola sejarah langkah-langkah dan merender seluruh permainan
export default function Game() {
  // State untuk menyimpan sejarah langkah-langkah dan langkah saat ini
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // Menentukan giliran pemain berikutnya
  const currentSquares = history[currentMove]; // Mendapatkan status papan saat ini

  // Fungsi jumpTo: Mengatur langkah saat ini ke langkah tertentu
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

   // Fungsi handlePlay: Memperbarui sejarah dengan langkah baru
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Fungsi resetGame: Mengatur ulang permainan ke awal
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Membuat daftar tombol untuk melompat ke langkah tertentu
  const moves = history.map((squares, move) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onReset={resetGame} />
      </div>
      {/* <div className="game-info">
        <ol>{moves}</ol>
      </div> */}
    </div>
  );
}

// Fungsi calculateWinner: Menentukan pemenang berdasarkan status papan
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Mengecek setiap kombinasi kemenangan
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Jika ditemukan kombinasi kemenangan, mengembalikan nilai pemenang ('X' atau 'O')
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null; // Mengembalikan null jika tidak ada pemenang
}
