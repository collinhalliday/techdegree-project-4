//main Module: Creates a module for all of the code in this file through use of an immediately-executing,
//self-contained object interface.
const main = (function(){
  
  ////main object: object into which the game object below is stored.
  const main = {};

  //Creates a gameState array that mirrors the Tic Tac Toe game board in the user interface
  //and populates it with indexes that match those of the game board.
  let gameState = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  //Creates a new game object and passes the new gameState as its argument, essentially giving
  //it a map of the Tic Tac Toe game board to work with for various methods and calculations.
  main.game = new myGame.Game(gameState);

  //Returns the main object containing the game object above.
  return main;

//End of module.
})();
