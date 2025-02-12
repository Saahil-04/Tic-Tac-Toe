const GameBoard = (() => {

    let board = ["", "", "", "", "", "", "", "", ""];
    const getboard = () => board;
    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        console.log(board);
        return board;
    }

    return { getboard, updateBoard, resetBoard };
})();

const Player = (name, marker) => ({ name, marker });


const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;

    const getCurrentPlayer = () => currentPlayer;

    const changePlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkForWin = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]];// Diagonals

        const board = GameBoard.getboard();

        for (i = 0; i < winPatterns.length; i++) {
            const [a, b, c] = winPatterns[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                // drawWinningLine(pattern); // Draws a line through the winning cells
                return board[a]; // Returns "X" or "O" if there's a winner
            }
        }
        return board.includes("") ? null : "draw";  // Returns "draw" if there's a draw
    };
    return { getCurrentPlayer, changePlayer, checkForWin };
})();

const DisplayController = (() => {
    const gameBoardelement = document.getElementById("game-board");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restartbtn");

    function render() {
        gameBoardelement.innerHTML = "";
        const board = GameBoard.getboard();
        board.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => handleMove(index));
            gameBoardelement.appendChild(cellElement);
            if(board[index] !== "") {
                cellElement.classList.add('taken');
            }
        });

    }

    function handleMove(index) {
        if (GameBoard.updateBoard(index, GameController.getCurrentPlayer().marker)) {
            render();
            const result = GameController.checkForWin();
            if (result) {
                if (result === "draw") {
                    messageElement.textContent = "It's a draw!";
                } else {
                    messageElement.textContent = `${result} wins!`;
                }
                return;
            }
            GameController.changePlayer();
            messageElement.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
        }
    }


    restartButton.addEventListener("click", () => {
        console.log("restart button clicked")
        GameBoard.resetBoard();
        GameController.changePlayer();
        messageElement.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
        render();
    });
    return { render };

})();

DisplayController.render();