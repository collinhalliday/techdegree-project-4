//myGame Module: Creates a module for all of the code in this file through use of an immediately-executing,
// self-contained object interface.
const myGame = (function() {

  //myGame object: object into which the constructor and methods below are stored.
  const myGame = {};

  /*
  Game object constructor: takes a gameState argument and includes both a human and a computer instance variable initialized
  to a particular letter. Because this game allows the user to choose whether the user goes first or the computer goes first,
  the values with which this.computer and this.human are initialized will not necessarily represent that player's actual
  letter in the game. They are used more as reference values that allow the below minimax method to analyze different game
  states from different player's perspectives.
  */
  myGame.Game = function(gameState) {
    this.gameState = gameState;
    this.computer = 'o';
    this.human = 'x';
  }

  /*
  Minimax method: The meat of the Tic Tac Toe AI opponent.
  The basic method takes a gameState array (i.e. [0,1,2,'x','o',5,6,7,8]) that mimics the current state of the game board in
  the game user interface, and a player (computer or human/ 'x' or 'o') as arguments. The depth parameter is discussed below,
  as it was later added to address a problem with the basic minimax AI. Ignore it for now.

  If the gameState indicates a game-over scenario (a tie or a win), the gameState is passed to score(), which returns a score
  object with a score property and associated value of 10 if the computer wins, -10 if the human wins, and 0 if there is a tie.
  If the gameState does not indicate a game-over scenario (no tie or win), the method filters the gameState array to include
  only available moves (spaces that do not include an 'o' or 'x') and stores the resulting array in the availableMoves variable.

  The method then creates an empty array to store potential move objects for each level of analysis. Each move object
  is later assigned both a move index and a score. As such, the move objects are assigned to the variable moveIndexAndScore.
  The method loops through the availableMoves array, and for each available move, the method assigns an index to the
  moveIndexAndScore object, representing the index of the potential move, a move to the gameState ('x' or 'o') depending on
  which player's turn it is, and then it takes the gameState to an end-of-game state. It does this by calling itself and
  passing as arguments (1) the new copy of the gameState that now includes a potential move, and (2) the player whose turn it
  will be after the potential move is taken. This way, each time the method is called, it is called from the perspective of the
  appropriate player. The method will continue calling itself until an end-of-game state is reached and a score object with a
  point value is returned (10 (this.computer wins), -10 (this.human wins), or 0 (tie)).

  Most potential moves, once made, will result in a new set of potential moves associated with that move. Each of the potential
  moves from the new set will eventually also be tested to an end-of-game state, generating its own new set of potential moves and
  so on. As such, the method ends up going through many different branches of moves at each different level of gameplay, resulting
  in a game tree of potential moves and their associated outcomes. It is easier to grasp this concept by looking at examples online,
  or by creating your own game trees at near-end game states and running through them to the end-of-game states.

  Each level of method that is not called with an end-of-game state as an argument will store in a result variable either the
  score object from the end-of-game state passed as an argument to the level below it, or the best move object returned from the
  level below it. The best move for each level is determined from the perspective of the player whose turn it is. If it is the
  computer's turn (i.e. this.computer is passed as an argument to a particular method call), the method call will return a move
  based on the highest score in the potentialMoves array. If there are multiple highest scores of the same value within the
  potentialMoves array, the method will use the first of these scores to return the first move that contains the highest score.
  If it is the human's turn (i.e. this.human is passed as an argument to a particular method call), the method call will return a
  move based on the lowest score in the potentialMoves array.

  Once an end-of-game state is reached and a level's score object is returned to the level above it, that level's result variable
  is assigned to the score object, and the value of the result variable's score property is then assigned to that level's
  moveIndexAndScore object's score property. The potential move being analyzed is then reset. This allows the method to attempt
  thousands of potential gameStates with the same gameState array. It also allows the program to utilize the gameState array
  in keeping track of wins, loses and ties. Afterwards, the moveIndexAndScore object is pushed to the end of the potentialMoves
  array.

  Once this is accomplished, the method exits the loop over the available Moves array and searches for and returns the bestMove
  object to the level above it. The level above it will go through the same process, but an additional time, as it will have one
  more potential move than the level below it to test, and thus, another moveIndexAndScore object to populate and add to its
  potentialMoves array.

  This multi-level analysis will continue until all possible game states and their potential moves have been analyzed, scored and
  the best move overall is returned to the top level of method calls (again, if there are multiple 'best moves', the first will be
  returned).

  The basic minimax method accomplishes is purpose: it creates un unbeatable AI opponent. However, it does not always do so in the
  most efficient manner. When the method searches for the best move in an array of multiple moves that contain the same high score,
  it will choose the first one that it encounters. This will sometimes cause it to choose a move that will make the computer's win
  take longer. Let's look at the following board for an example:
                                                                x|o|x
                                                                 |o|
                                                                 | |X
  Given this board, if the computer is 'o', the human opponent is 'x', and it is the computer's turn, the computer should choose
  the space at index 7, resulting in an instant win.
                                                                x|o|x
                                                                 |o|
                                                                 |o|X
  However, the computer does not do this with the basic minimax method. Instead, the computer will choose the space at index 5.
                                                                x|o|x
                                                                 |o|o
                                                                 | |X
  Although this will still lead to an inevitable win for the computer, it will take longer for the computer to win and the computer
  ends up being less efficient than it otherwise could be. To fix this, we can use the concept of depth. Depth basically allows our
  program to keep track of the number of levels deep our analysis goes before reaching an end-of-game state. When calculating
  scores at game-end, we can either subract the depth for the player attempting to maximize their score (computer), or subtract the
  score of the minimizing player (human) from depth. The more levels required to reach an end-of-game state, the lower or higher a
  score will be, depending on which player's perspective the method is scoring from. This adjusts the analysis such that, moves that
  used to have the same highest (or lowest) score now only have the same score when their end-of-game states are reached at the same
  depth. As such, when choosing the best score, the method will choose the score that takes fewer levels to reach its associated
  end-of-game state.
  */
  myGame.Game.prototype.minimax = function(gameState, player, depth) {
      if(this.isOver(gameState))
        return this.score(gameState, depth);
      depth++;
      let availableMoves = this.getAvailableMoves(gameState);
      let potentialMoves = [];
      availableMoves.forEach(move => {
        let moveIndexAndScore = {};
        moveIndexAndScore.index = move;
        gameState[move] = player;
        if (player === this.computer){
          let result = this.minimax(gameState, this.human, depth);
          moveIndexAndScore.score = result.score;
        }
        else {
          let result = this.minimax(gameState, this.computer, depth);
          moveIndexAndScore.score = result.score;
        }
        gameState[move] = move;
        potentialMoves.push(moveIndexAndScore);
      });
      return this.getBestMove(player, potentialMoves);
   }

   /*
   getBestMove method: Takes as arguments the player whose turn it is for purposes of the multi-level recursive analysis, and
   finds and returns the best move to the minimax method. If player is this.computer, the method looks for the maximum score
   of the moves in the potentialMovesArray and returns the first move with the maximum score. If player is this.human, it looks
   for and returns the first move with the minimum score.
   */
   myGame.Game.prototype.getBestMove = function(player, potentialMovesArray) {
      let bestMoveIndex;
      let moveIndex = -1;
      if(player === this.computer) {
        let bestScore = -11;
        potentialMovesArray.forEach(move => {
          moveIndex++;
          if(move.score > bestScore) {
            bestScore = move.score;
            bestMoveIndex = moveIndex;
          }
        });
      } else {
        let bestScore = 11;
        potentialMovesArray.forEach(move => {
          moveIndex++;
          if(move.score < bestScore) {
            bestScore = move.score;
            bestMoveIndex = moveIndex;
          }
        });
      }
      return potentialMovesArray[bestMoveIndex];
    }

  //Score method: returns a score of (10 - depth) if computer ('o') wins, (depth -1) if human ('x') wins, or 0 if there is a tie.
  myGame.Game.prototype.score = function(gameState, depth) {
      if (this.isWonBy(gameState, this.computer)) {
          return {score: (10 - depth)};
      } else if (this.isWonBy(gameState, this.human)) {
          return {score: (depth - 10)};
      } else
          return {score: 0};
  }

  //isOver method: determins if the game is over by calling isWon() on both players and isTied() with the current gameState.
  myGame.Game.prototype.isOver = function(gameState) {
    return this.isWonBy(gameState, this.computer) || this.isWonBy(gameState, this.human) || this.isTied(gameState) || false;
  }

  //isTied method: determins if there is a tie by looping over all of the boxes and returning true or false depending on
  //whether or not there are any spaces that do not include an 'x' or an 'o'. It is always called after first checking for
  //a win.
  myGame.Game.prototype.isTied = function(gameState) {
    let count = 0;
    gameState.forEach(box => {
      if(box === 'x' || box === 'o')
        count++;
    });
    if(count === 9)
      return true;
    else
      return false;
  }

  //isWonBy method: determines if there is a win by comparing the values in the gameState array with the player ('x' or 'o')
  //passed as an argument.
  myGame.Game.prototype.isWonBy = function (gameState, player) {
    function checkForWin(boxOne, boxTwo, boxThree) {
        if(boxOne === player && boxTwo === player && boxThree === player)
          return true;
        else
          return false;
    }
    const row1 = checkForWin(gameState[0], gameState[1], gameState[2]);
    const row2 = checkForWin(gameState[3], gameState[4], gameState[5]);
    const row3 = checkForWin(gameState[6], gameState[7], gameState[8]);
    const column1 = checkForWin(gameState[0], gameState[3], gameState[6]);
    const column2 = checkForWin(gameState[1], gameState[4], gameState[7]);
    const column3 = checkForWin(gameState[2], gameState[5], gameState[8]);
    const diagonal1 = checkForWin(gameState[0], gameState[4], gameState[8]);
    const diagonal2 = checkForWin(gameState[2], gameState[4], gameState[6]);
    if(row1 || row2 || row3 ||
       column1 || column2 || column3 ||
       diagonal1 || diagonal2)
          return true;
    else
      return false;
  }

  //getCurrentGameState method: returns the current gameState which is regularly updated with each move in the game.
  myGame.Game.prototype.getCurrentGameState = function() {
    return this.gameState;
  }

  //updateGameState method: updates the gameState by looping through the boxes and assigning the appropriate letter
  //to each corresponding index of the gameState array.
  myGame.Game.prototype.updateGameState = function(gameState) {
    for(let i = 0; i < gameUI.boxes.length; i++) {
      if(gameUI.boxes[i].className.includes('1'))
        gameState[i] = 'o';
      else if(gameUI.boxes[i].className.includes('2'))
        gameState[i] = 'x';
    }
  }

  //getAvailableMoves method: filters the gameState array and returns a new array that excludes those indicies with a
  //value of 'x' or 'o'.
  myGame.Game.prototype.getAvailableMoves = function(gameState) {
    return gameState.filter(move => move !== 'x' && move !== 'o');
  }

  //returns the myGame object and all of its contents(the constructore and methods above).
  return myGame;

//End of module.
})();
