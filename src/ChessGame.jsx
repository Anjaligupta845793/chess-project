import React from "react";
import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessGame = () => {
  const [game, setgame] = useState(new Chess());
  const [moveLog, setmoveLog] = useState([]);
  const [type, settype] = useState("");

  const pieceIcons = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  const convertToIcon = (move) => {
    return move.replace(/[KQRBNP]/gi, (char) => pieceIcons[char] || char);
  };

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
          setmoveLog((prev) => {
            const updatedLog = [...prev];
            if (game.turn() === "b") {
              updatedLog.push({ white: move.san });
            } else {
              updatedLog[updatedLog.length - 1].black = move.san;
            }
            return updatedLog;
          });
          return move !== null;
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
    <div>
      <div className="max-[1260px] flex md:flex-row flex-col mx-auto px-10 gap-4 ">
        <div style={boardContainerStyle}>
          <div className="text-black text-2xl md:py-2 py-10">
            {getGameStatus()}
          </div>
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
        </div>
        <div className="py-10 border-[1] border-black  ">
          <div className="flex gap-10 items-center">
            <h1 className="text-2xl font-bold">Move Logs</h1>
            <button
              className="px-3 py-2 font-bold text-black rounded bg-blue-400"
              onClick={resetGame}
            >
              Start New Game
            </button>
          </div>

          {moveLog.length > 0 ? (
            <table className="mt-10">
              {" "}
              <tbody>
                {moveLog.map((item, index) => (
                  <tr key={index} className="py-2">
                    <td className="px-3">{`${index + 1}.`}</td>
                    <td className="px-3">{convertToIcon(item.white || "")}</td>
                    <td className="px-6">{convertToIcon(item.black || "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>no moves yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
