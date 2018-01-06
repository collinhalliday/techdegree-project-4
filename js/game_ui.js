//gameUI Module: Creates a module for all of the code in this file through use of an immediately-executing,
// self-contained object interface.
const gameUI = (function(){

  //gameUI object: object into which the boxes element below is stored. It is the only element used by other modules.
  const gameUI = {};

  //Start Screen Variables
  const startScreenDiv = document.getElementById('start');
  const startButton = $('a[class="button"]')[0];

  //Game Board Variables
  const gameBoardDiv = document.querySelector('#board');
  const player1TurnIndicator = document.getElementById('player1');
  const player2TurnIndicator = document.getElementById('player2');
  const boxesUl = document.getElementsByClassName('boxes')[0];
  gameUI.boxes = boxesUl.querySelectorAll('li');

  //Game End Screen Variables
  const gameEndDiv = $('#finish')[0];
  const gameEndMessage = $('.message')[0];
  const newGameButton = $('a[class="button"]')[1];

  //Player Number Option Variables
  const playerNumberOptionDiv = createElement('div');
  playerNumberOptionDiv.style.marginTop = '80px';
  const singlePlayerButton = createElement('button');
  singlePlayerButton.className = 'button';
  singlePlayerButton.textContent = 'Single Player';
  singlePlayerButton.style.marginRight = '5px';
  const multiPlayerButton = createElement('button');
  multiPlayerButton.className = 'button';
  multiPlayerButton.textContent = 'MultiPlayer';
  multiPlayerButton.style.marginLeft = '5px';
  playerNumberOptionDiv.appendChild(singlePlayerButton);
  playerNumberOptionDiv.appendChild(multiPlayerButton);
  $(startButton).before(playerNumberOptionDiv);
  let againstComputer = false;

  //Player Order Option Variables
  const playerOrderOptionDiv = createElement('div');
  playerOrderOptionDiv.style.marginTop = '80px';
  playerOrderOptionDiv.style.color = 'white';
  const $playerOrderOptionParagraph = $(`
    <p>Would you like to go <a href="#" class="button">1st</a> or <a href="#" class="button">2nd</a>?</p>
    `);
  $playerOrderOptionParagraph[0].style.fontWeight = 'bold';
  const firstButton = $playerOrderOptionParagraph.children()[0];
  const secondButton = $playerOrderOptionParagraph.children()[1];
  playerOrderOptionDiv.appendChild($playerOrderOptionParagraph[0]);
  $(startButton).before(playerOrderOptionDiv);
  let computerFirst = false;

  //Return to Main Menu Variables
  const returnToMainMenuDiv = createElement('div');
  returnToMainMenuDiv.style.marginTop = '20px';
  const returnToMainMenuButton = createElement('a');
  returnToMainMenuButton.href = '#';
  returnToMainMenuButton.className = 'button';
  returnToMainMenuButton.textContent = 'Return to Main Menu';
  returnToMainMenuDiv.appendChild(returnToMainMenuButton);
  $(newGameButton).after(returnToMainMenuDiv);

  //Player Name Variables
  let computerName = 'Computer';
  let oNameHeader = createElement('h1');
  oNameHeader.style.left = '2.5%';
  oNameHeader.style.textAlign = 'center';
  oNameHeader.style.position = 'absolute';
  oNameHeader.style.width = '35%';
  oNameHeader.style.marginTop = '20px';
  let xNameHeader = createElement('h1');
  xNameHeader.style.right = '2.5%';
  xNameHeader.style.textAlign = 'center';
  xNameHeader.style.position = 'absolute';
  xNameHeader.style.width = '35%';
  xNameHeader.style.marginTop = '20px';

  //Creates and returns an element based on the element type passed as the argument.
  function createElement(element) {
    return document.createElement(element);
  }

  //Hides any number of elements passed as arguments.
  function hideElements(...elements) {
    elements.forEach(element => element.style.display = 'none');
  }

  //Shows any number of elements passed as arguments.
  function showElements(...elements) {
    elements.forEach(element => element.style.display = '');
  }

  //Removes the specified class name from the element passed in.
  function removeClass(element, className) {
    element.classList.remove(className);
  }

  //Hides the game board, game end screen, player number options and player order options on page load.
  window.onload = function () {
    hideElements(gameBoardDiv, gameEndDiv, playerNumberOptionDiv, $playerOrderOptionParagraph[0]);
  }

  //On click of the start button, the startScreenDiv is hidden and the gameBoardDiv is shown.
  $(startButton).on('click', function() {
    hideElements(startButton);
    showElements(playerNumberOptionDiv);
  });

  //SinglePlayerButton Event Listener: sets againstComputer to true, hides the player number buttons
  //and shows the player order paragraph and buttons.
  singlePlayerButton.addEventListener('click', function(event) {
      againstComputer = true;
      hideElements(playerNumberOptionDiv);
      showElements($playerOrderOptionParagraph[0]);
  });

  //MultiPlayerButton Event Listener: Prompts the user to enter names for both first and second players and sets
  //the user input equal to the apprpriate name header's textContent. Appends those headers to the page. Hides the
  //start screen and player number div, shows the game board div and sets the first player turn indicator to 'active'.
  multiPlayerButton.addEventListener('click', function(event) {
      oNameHeader.textContent = promptForName('Please enter a name for Player 1');
      player1TurnIndicator.parentNode.parentNode.appendChild(oNameHeader);
      xNameHeader.textContent = promptForName('Please enter a name for Player 2');
      player2TurnIndicator.parentNode.parentNode.appendChild(xNameHeader);
      hideElements(startScreenDiv, playerNumberOptionDiv);
      showElements(gameBoardDiv);
      player1TurnIndicator.className += ' active';
  });

  /*
  PlayerOrderOPtionParagraph Event Listener: Prompts the user to enter their name based on the order of play
  chosen. Sets the user input equal to the text content of the appropriate name header and appends the name headers
  to the header of the game board div. Hides the start screen and the player order options, shows the game board,
  sets first player's turn indicator to 'active', and if the user chooses to go 2nd, sets computerFirst equal to
  true and makes the computer's first move.
  */
  $($playerOrderOptionParagraph[0]).on('click', function(event) {
    if(event.target.tagName === 'A') {
      if(event.target.textContent === '1st') {
        oNameHeader.textContent = promptForName('Please enter your name.');
        player1TurnIndicator.parentNode.parentNode.appendChild(oNameHeader);
        xNameHeader.textContent = computerName;
        player2TurnIndicator.parentNode.parentNode.appendChild(xNameHeader);
      } else {
        xNameHeader.textContent = promptForName('Please enter your name.');
        player2TurnIndicator.parentNode.parentNode.appendChild(xNameHeader);
        oNameHeader.textContent = computerName;
        player1TurnIndicator.parentNode.parentNode.appendChild(oNameHeader);
      }
      hideElements(startScreenDiv, $playerOrderOptionParagraph[0]);
      showElements(gameBoardDiv);
      player1TurnIndicator.className += ' active';
      if(event.target.textContent === '2nd') {
        computerFirst = true;
        setTimeout(() => computerMove(player2TurnIndicator, player1TurnIndicator, ' box-filled-1', 'o'), 1000);
      }
    }
  });

  //Prompts user to enter input based on message passed as argument. If player does not enter anything, alerts player
  //that a name must be entered and loops until a name is entered, returning the result.
  function promptForName(promptMessage) {
    let name;
      do {
        name = prompt(promptMessage);
        if(name === '')
          alert('You must enter a name to continue.');
      } while(name === '');
    return name;
  }

  //BoxesUl Event Listener: On mouseover, sets the appropriate background image for each box based on whether or not
  //the computer is playing and based on which player is active.
  boxesUl.addEventListener('mouseover', function(event) {
    if(!event.target.className.includes('box-filled')) {
      if(!againstComputer) {
          if(player1TurnIndicator.className.includes('active'))
            event.target.style.backgroundImage = "url('img/o.svg')";
          else if(player2TurnIndicator.className.includes('active'))
            event.target.style.backgroundImage = "url('img/x.svg')";
      } else {
        if(computerFirst) {
          if(player2TurnIndicator.className.includes('active'))
            event.target.style.backgroundImage = "url('img/x.svg')";
        } else {
          if(player1TurnIndicator.className.includes('active'))
            event.target.style.backgroundImage = "url('img/o.svg')";
        }
      }
    }
  });

  //BoxesUl Event Listener: removes the background for each box once the mouse leaves that box.
  boxesUl.addEventListener('mouseout', function(event) {
        event.target.style.backgroundImage = '';
  });

  //BoxesUl Event Listener: On click, if the computer is playing, calls computerOpponent() with the appropriate
  //parameters based on which player goes first. Otherwise, calls mutiPlayer().
  boxesUl.addEventListener('click', function(event) {
    if(againstComputer) {
      if(computerFirst) {
        computerOpponent(event.target, player2TurnIndicator, player1TurnIndicator, ' box-filled-2', ' box-filled-1', 'x', 'o');
      } else
        computerOpponent(event.target, player1TurnIndicator, player2TurnIndicator,  ' box-filled-1', ' box-filled-2', 'o', 'x');
    } else
      multiPlayer(event.target);
  });

  /*
  If the box clicked is not already taken and it is the player's turn, sets the box's class based on the order of play,
  updates the gameState array in the current game object so it mirrors the game board, sets computer's class to 'active',
  and if the game is not over, makes a move for the computer after a short delay. Ends by checking for game end state.
  If game is over, calls endGame().
  */
  function computerOpponent(box, playerTurnIndicator, computerTurnIndicator, playerClassName, computerClassName, humanLetter, computerLetter) {
    if(!box.className.includes('box-filled') &&
       playerTurnIndicator.className.includes('active')) {
          box.className += playerClassName;
          main.game.updateGameState(main.game.getCurrentGameState());
          removeClass(playerTurnIndicator, 'active');
          computerTurnIndicator.className += ' active';
          if(!main.game.isOver(main.game.getCurrentGameState())) {
            setTimeout(() => computerMove(playerTurnIndicator, computerTurnIndicator, computerClassName, computerLetter), 1000);
          }
          if(main.game.isOver(main.game.getCurrentGameState()))
            endGame();
    }
  }

  //If the box clicked is not already taken, the box clicked is given the approprite class name. Then, the next player's class
  //is set to 'active'. Ends by checking for game end state. If game is over, calls endGame();
  function multiPlayer(box) {
    if(!box.className.includes('box-filled')) {
      if(player1TurnIndicator.className.includes('active')) {
        box.className += ' box-filled-1';
        main.game.updateGameState(main.game.getCurrentGameState());
      } else if(player2TurnIndicator.className.includes('active')) {
        box.className += ' box-filled-2';
        main.game.updateGameState(main.game.getCurrentGameState());
      }
      if(player1TurnIndicator.className.includes('active')) {
        removeClass(player1TurnIndicator, 'active');
        player2TurnIndicator.className += ' active';
      } else {
        removeClass(player2TurnIndicator, 'active');
        player1TurnIndicator.className += ' active';
      }
      if(main.game.isOver(main.game.getCurrentGameState()))
        endGame();
    }
  }

  /*
  Makes a move for the computer after a short delay based on which player goes first, and updates the game state in
  the game object. Removes the computer's 'active' class and applies it to player. Because the function is called
  within setTimeout(), I had to check for game-end state again at the end of the function. This no longer works for
  computer at the end of computerOpponent(). It only works for player.
  */
  function computerMove(playerTurnIndicator, computerTurnIndicator, computerClassName, computerLetter) {
    gameUI.boxes[main.game.minimax(main.game.getCurrentGameState(), computerLetter, 0).index].className += computerClassName;
    main.game.updateGameState(main.game.getCurrentGameState());
    removeClass(computerTurnIndicator, 'active');
    playerTurnIndicator.className += ' active';
    if(main.game.isOver(main.game.getCurrentGameState()))
      endGame();
  }


  // Checks to see who won, and if there is a win, applyies the appropriate class and calls showWinningScreen().
  // If there is a tie, the appropriate game end screen and message are shown after a short delay.
  function endGame() {
      if(main.game.isWonBy(main.game.getCurrentGameState(), 'x')) {
           gameEndDiv.className += ' screen-win-two';
           showWinningScreen();
      } else if(main.game.isWonBy(main.game.getCurrentGameState(), 'o')) {
          gameEndDiv.className += ' screen-win-one';
          showWinningScreen();
      } else {
          gameEndMessage.textContent = "It's a tie!";
          gameEndDiv.className += ' screen-win-tie';
          setTimeout(() => {
          hideElements(gameBoardDiv);
          showElements(gameEndDiv, returnToMainMenuDiv);
          }, 1000);
    }
  }

  //Applies the apprpriate message to the gameEndDiv. Then, it removes the 'active' class from both player turn
  //indicators, disallowing either player to continue clicking boxes after a win has occurred, and it hides the
  //game board and shows the game end screen after a short delay.
  function showWinningScreen() {
    if(main.game.isWonBy(main.game.gameState, 'o'))
        gameEndMessage.textContent = oNameHeader.textContent + ' Wins!';
    else
        gameEndMessage.textContent = xNameHeader.textContent + ' Wins!';
    removeClass(player1TurnIndicator, 'active');
    removeClass(player2TurnIndicator, 'active');
    setTimeout(() => {
      hideElements(gameBoardDiv);
      showElements(gameEndDiv);
    }, 1000);
  }

  //NewGameButton Event Handler: Upon a button click, resets the game and shows the game board. If computerFirst is true,
  //it makes the computer's first move.
  $(newGameButton).on('click', function() {
    resetGame();
    showElements(gameBoardDiv);
    if(computerFirst)
      setTimeout(() => computerMove(player2TurnIndicator, player1TurnIndicator, ' box-filled-1', 'o'), 1000);
  });

  //ReturnToMainMenuDiv Event Listener: Upon click, removes name headers, resets the game board and shows the start screen
  //and button.
  returnToMainMenuDiv.addEventListener('click', function() {
    againstComputer = false;
    computerFirst = false;
    oNameHeader.remove();
    xNameHeader.remove();
    resetGame();
    showElements(startScreenDiv, startButton);
  });

  //Hides the game end screen, removes all game end classes therefrom, resets first player's turn indicator to 'active',
  //creates a new game object with a fresh game state, and removes all 'box-filled' classes from the boxesUl.
  function resetGame() {
    hideElements(gameEndDiv);
    removeClass(gameEndDiv, 'screen-win-two');
    removeClass(gameEndDiv, 'screen-win-one');
    removeClass(gameEndDiv, 'screen-win-tie');
    player1TurnIndicator.className += ' active';
    removeClass(player2TurnIndicator, 'active');
    // main.createNewGame();
    main.game = new myGame.Game([0,1,2,3,4,5,6,7,8]);
    gameUI.boxes.forEach(box => {
      removeClass(box, 'box-filled-1');
      removeClass(box, 'box-filled-2');
    });
  }

  //returns the gameUI object and all non-private contents(the box element above).
  return gameUI;

//End of module.
}());
