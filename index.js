//It targets all 9 grid boxes so you can control their content (X or O), style, and click behavior.
//boxes: A NodeList of all <div class="box"> elements in your 3×3 grid.
let boxes = document.querySelectorAll(".box");

//These variables track the game state.
//You use turn to determine which player moves next.
//isGameOver prevents further moves after a win or draw.
let turn = "X";
let isGameOver = false;

/* 
For each cell in the grid:
    Clear any pre-filled content (e.innerHTML = "")
    Attach a click event handler:
        Prevent moves if the game is over or box is not empty.
        Place the current player's symbol (X or O) into the clicked box.
        Check for a win.
        If no win, check for a draw.
        If game continues, change the turn.
This updates the DOM directly and makes the game interactive.
*/
boxes.forEach((e) => {
  e.innerHTML = "";
  e.addEventListener("click", () => {
    if (!isGameOver && e.innerHTML === "") {
      e.innerHTML = turn;
      checkWin();
      checkDraw();
      changeTurn();
    }
  });
});

/* 
Switching Turns & Updating the Highlight -------------------------------------------------------------------
The .bg (pink bar from the CSS) moves left or right to indicate whose turn it is:
    "left: 0" → under X
    "left: 85px" → under O
This matches the .bg element in the HTML
Visual feedback matches game logic.
*/
function changeTurn() {
  if (turn === "X") {
    turn = "O";
    document.querySelector(".bg").style.left = "85px";
  } else {
    turn = "X";
    document.querySelector(".bg").style.left = "0";
  }
}

/* 
WIN Checking Logic ---------------------------------------------------------------------------------------
These are all the possible winning index combinations, 8 in total.
Goes through every way someone could win (3 rows, 3 columns, 2 diagonals).
Pulls out the text inside those 3 boxes.
If all 3 have the same symbol and are not empty, it’s a win.
Each inner array refers to indexes in the boxes list.
*/
function checkWin() {
  let winConditions = [
    [0, 1, 2],[3, 4, 5],[6, 7, 8],  //Rows
    [0, 3, 6],[1, 4, 7],[2, 5, 8],  //Columns
    [0, 4, 8],[2, 4, 6],            //Diagonals
  ];
  /* 
  Looping Through Win Conditions:
  v0, v1, v2: The current values in the three winning positions.
  Ex. when i = 6 ==> winConditions[6] = [0, 4, 8]
  You are cheching the diagonal:
    v0 = boxes[0].innerHTML
    v1 = boxes[4].innerHTML
    v2 = boxes[8].innerHTML
  */
  for (let i = 0; i < winConditions.length; i++) {
    let v0 = boxes[winConditions[i][0]].innerHTML;
    let v1 = boxes[winConditions[i][1]].innerHTML;
    let v2 = boxes[winConditions[i][2]].innerHTML;

    /* 
    Checking for a Win:
    If all 3 values are equal (and not empty), current player wins.
    #results text updated to show winner.
    #play-again button becomes visible.
    */
    if (v0 != "" && v0 === v1 && v0 === v2) {
      isGameOver = true;
      document.querySelector("#results").innerHTML = turn + " wins! 🥳";
      document.querySelector("#play-again").style.display = "inline";

      for (j = 0; j < 3; j++) {
        //Winning cells get a highlight color and black text for contrast.
        boxes[winConditions[i][j]].style.backgroundColor = "#53FF45";
        boxes[winConditions[i][j]].style.color = "#000";
      }
    }
  }
}

/* 
DRAW Checking Logic --------------------------------------------------------------------------------------
Only runs if no one has won yet.
Iterates through all boxes:
*/
function checkDraw() {
  if (!isGameOver) {
    
    let isDraw = true;
    //You're starting with the assumption that all boxes are filled.
    //If you find an empty box, you'll flip isDraw to false.
    boxes.forEach((e) => {
      if (e.innerHTML === "") isDraw = false;
    });
    
    //Declare Draw If isDraw Still True
    //If all 9 boxes were filled and no winner: Update #results to show “Draw”.
    //Mark game as over. Update #results and show reset button.
    if (isDraw) {
      isGameOver = true;
      document.querySelector("#results").innerHTML = "Draw...🤝";
      document.querySelector("#play-again").style.display = "inline";
    }
  }
    //The checkWin() function runs before checkDraw() every turn.
    //That’s why the draw is only possible if no win was found first.
}

/* 
Resetting the Game -------------------------------------------------------------------------------------
Game state (isGameOver = false). Turn goes back to "X"
Reset turn indicator bar to "left: 0" (under X). Clear result text
Hide "Play Again" button
*/
document.querySelector("#play-again").addEventListener("click", () => {
  isGameOver = false;
  turn = "X";
  document.querySelector(".bg").style.left = "0";
  document.querySelector("#results").innerHTML = "";
  document.querySelector("#play-again").style.display = "none";

  //Each cell is emptied. Background and color reset to default.
  boxes.forEach((e) => {
    e.innerHTML = "";
    e.style.removeProperty("background-color");
    e.style.color = "#fff";
  });
});
