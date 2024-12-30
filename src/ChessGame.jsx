import React from "react";
import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessGame = () => {
  const [game, setgame] = useState(new Chess());
  const [moveLog, setmoveLog] = useState([]);

  const containerStyle = {
    width: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    gap: "20px",
    flexDirection: window.innerWidth < 768 ? "column" : "row",
  };

  const boardContainerStyle = {
    flex: 2,
    maxWidth: "600px",
  };

  const moveLogStyle = {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "15px",
  };

  const moveListStyle = {
    height: "400px",
    overflowY: "auto",
    border: "1px solid #eee",
    padding: "10px",
  };

  const moveItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  };

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "15px",
  };

  const statusStyle = {
    fontSize: "20px",
    marginBottom: "15px",
    textAlign: "center",
    color: game.inCheck() ? "#d32f2f" : "white",
  };
  // On drop function
  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      try {
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
        if (move) {
          setgame(new Chess(game.fen()));
          const moveNotation = `${game.turn() === "w" ? "black" : "white"}: ${
            move.san
          }`;
          setMoveLog((prev) => [
            ...prev,
            { white: whiteMove, black: blackMove },
          ]);
          return true;
        }
      } catch (error) {
        return false;
      }
    },
    [game]
  );

  const getGameStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) return "Checkmate";
      if (game.isDraw()) return "Draw";
      if (game.isStalemate()) return "Stalemate";
      return "Game Over!!";
    }
    if (game.isCheck()) {
      return "Check!";
    }
    return `${game.turn() === "w" ? "White" : "Black"} to move`;
  };
  const resetGame = () => {
    setgame(new Chess());
    setmoveLog([]);
  };

  return (
    <div style={containerStyle}>
      <div style={boardContainerStyle}>
        <div style={statusStyle}>{getGameStatus()}</div>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
          customDarkSquareStyle={{ backgroundColor: "#779952" }}
          customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        />
        <button style={buttonStyle} onClick={resetGame}>
          Start New Game
        </button>
      </div>
      <div style={moveLogStyle}>
        <h1>moveLog</h1>
        {moveLog.length > 0 ? (
          <>
            <tbody>
              {moveLog.map((move, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                  <td>{index + 1}</td>
                  <td>{move?.white || ""}</td>
                  <td>{move?.black || ""}</td>
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <div>no moves yet</div>
        )}
      </div>
    </div>
  );
};

export default ChessGame;
