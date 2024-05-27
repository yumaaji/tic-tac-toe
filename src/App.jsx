/* eslint-disable react/prop-types */
import { useState } from 'react';

// Komponen Square: Merender sebuah tombol kotak tunggal
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Komponen Board: Merender papan permainan Tic-Tac-Toe dan mengelola logika permainan
function Board({ xIsNext, squares, onPlay }) {

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
  let status = '';
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      {/* Menampilkan status pemenang dan tombol untuk kembali ke awal permainan */}
      <div className="status">{status}</div>
      <div className="board">
        {/* Memanggil fungsi Square untuk setiap kotak pada papan permainan */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
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

  return false; // Mengembalikan false jika tidak ada pemenang
}
