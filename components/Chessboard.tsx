"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

import {
  isValidPawnMove,
  isValidRookMove,
  isValidKnightMove,
  isValidBishopMove,
  isValidQueenMove,
  isValidKingMove,
} from "./moveValidation";

interface ChessboardProps {
  userName: string;
}

const boardFields = Array(8)
  .fill(null)
  .map(() => Array(8).fill(0));

// ------------------------------------------------------------
// CONNECT DIRECTLY TO YOUR STANDALONE SOCKET SERVER (3001)
// ------------------------------------------------------------
const socket = io("http://localhost:3001");

const Chessboard = ({ userName }: ChessboardProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = White, 2 = Black

  const initialPieces = {
    "0-0": "bR",
    "0-1": "bN",
    "0-2": "bB",
    "0-3": "bQ",
    "0-4": "bK",
    "0-5": "bB",
    "0-6": "bN",
    "0-7": "bR",
    "1-0": "bP",
    "1-1": "bP",
    "1-2": "bP",
    "1-3": "bP",
    "1-4": "bP",
    "1-5": "bP",
    "1-6": "bP",
    "1-7": "bP",
    "6-0": "wP",
    "6-1": "wP",
    "6-2": "wP",
    "6-3": "wP",
    "6-4": "wP",
    "6-5": "wP",
    "6-6": "wP",
    "6-7": "wP",
    "7-0": "wR",
    "7-1": "wN",
    "7-2": "wB",
    "7-3": "wQ",
    "7-4": "wK",
    "7-5": "wB",
    "7-6": "wN",
    "7-7": "wR",
  };

  const [pieces, setPieces] = useState(initialPieces);
  const [history, setHistory] = useState<any[]>([]);

  // ------------------------------------------------------------
  // 1️⃣ Receive opponent moves
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("Socket connected:", socket.id);

    socket.on("move", ({ from, to }) => {
      console.log("Received opponent move:", from, "->", to);
      applyMove(from, to, false); // false = do not emit again
    });

    return () => {
      socket.off("move");
    };
  }, []);

  // ------------------------------------------------------------
  // 2️⃣ Apply move (local or remote)
  // ------------------------------------------------------------
  const applyMove = (from: string, to: string, sendToServer = true) => {
    const movingPiece = pieces[from];
    if (!movingPiece) return;

    // Save history
    setHistory((prev) => [...prev, { pieces: { ...pieces } }]);

    setPieces((prev) => {
      const updated = { ...prev };
      delete updated[from];
      updated[to] = movingPiece;
      return updated;
    });

    // Switch turn
    setCurrentPlayer((p) => (p === 1 ? 2 : 1));

    // Broadcast move to server
    if (sendToServer) {
      console.log("Sending move:", from, "->", to);
      socket.emit("move", { from, to });
    }
  };

  // ------------------------------------------------------------
  // 3️⃣ Handle clicking on board squares
  // ------------------------------------------------------------
  const handleCellClick = (row: number, col: number) => {
    const pos = `${row}-${col}`;
    const clickedPiece = pieces[pos];

    // Step 1: Select piece
    if (!selected) {
      if (!clickedPiece) return;

      const pieceColor = clickedPiece[0];

      if (
        (currentPlayer === 1 && pieceColor === "w") ||
        (currentPlayer === 2 && pieceColor === "b")
      ) {
        setSelected(pos);
      }
      return;
    }

    // Step 2: Move
    if (selected !== pos) {
      const movingPiece = pieces[selected];
      let isValidMove = false;

      switch (movingPiece[1]) {
        case "R":
          isValidMove = isValidRookMove(selected, pos, movingPiece, pieces);
          break;
        case "P":
          isValidMove = isValidPawnMove(selected, pos, movingPiece, pieces);
          break;
        case "N":
          isValidMove = isValidKnightMove(selected, pos, movingPiece, pieces);
          break;
        case "B":
          isValidMove = isValidBishopMove(selected, pos, movingPiece, pieces);
          break;
        case "Q":
          isValidMove = isValidQueenMove(selected, pos, movingPiece, pieces);
          break;
        case "K":
          isValidMove = isValidKingMove(selected, pos, movingPiece, pieces);
          break;
      }

      if (isValidMove) applyMove(selected, pos);
    }

    setSelected(null);
  };

  // ------------------------------------------------------------
  // 4️⃣ Render UI
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <div className="text-xl font-bold">
        {currentPlayer === 1
          ? "Player 1's Turn (White)"
          : "Player 2's Turn (Black)"}
      </div>

      <div className="grid grid-cols-8 grid-rows-8">
        {boardFields.map((row, rowIndex) =>
          row.map((_, colIndex) => {
            const isBlack = (rowIndex + colIndex) % 2 === 1;
            const pos = `${rowIndex}-${colIndex}`;
            const piece = pieces[pos];

            return (
              <div
                key={pos}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-14 h-14 flex justify-center items-center cursor-pointer
                ${isBlack ? "bg-amber-700" : "bg-white"}
                ${selected === pos ? "ring-4 ring-yellow-400" : ""}
              `}
              >
                {piece && (
                  <Image
                    src={`/pieces/${piece}.svg`}
                    alt={piece}
                    width={40}
                    height={40}
                    priority
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chessboard;
