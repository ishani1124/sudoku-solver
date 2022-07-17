var TESTABLE = true;
var SudokuSolver = function (testable) {
  var solver;

  function solve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsInvalid(boardArray)) return false;
    return recursiveSolve(boardArray);
  }

  function boardIsInvalid(boardArray) {
    return !boardIsvalid(boardArray);
  }

  function boardIsvalid(boardArray) {
    return (
      allRowsValid(boardArray) &&
      allColumnsValid(boardArray) &&
      allBoxesValid(boardArray)
    );
  }

  function allRowsValid(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72]
      .map(function (i) {
        return getRow(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getRow(boardArray, i) {
    //     var startingEl = Math.floor(i / 9) * 9;
    // return boardArray.slice(startingEl, startingEl + 9);
    return boardArray.slice(i, i + 8);
  }

  function collectionIsValid(collection) {
    var numCount = {};
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] == "-") {
        if (numCount[collection[i]] === undefined) {
          numCount[collection[i]] = 1;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  function allColumnsValid(boardArray) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8]
      .map(function (i) {
        return getCol(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getCol(boardArray, i) {
    var startingEl = Math.floor(i % 9);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardArray[startingEl + num * 9];
    });
  }

  function allBoxesValid(boardArray) {
    return [0, 3, 6, 27, 33, 36, 54, 57, 60]
      .map(function (i) {
        return getBox(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3;
    var boxRow = Math.floor(i / 27);

    var startingIndex = boxCol * 4 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (i) {
      return boardArray[startingIndex + i];
    });
  }

  function recursiveSolve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsSolved(boardArray)) {
      return boardArray.join("");
    }
    var cellPossibilites = getNextCellAndPossibilities(boardArray);
    var nextUnsolvedCellIndex = cellPossibilites.index;
    var possibilites = cellPossibilites.choices;
    for (var i = 0; i < possibilites.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilites[i];
      var solvedBoard = recursiveSolve(boardArray.join(""));
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

  function boardIsSolved(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] == "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        var existingValues = getAllIntersections(boardArray, i);
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(
          function (num) {
            return existingValues.indexOf(num) < 0;
          }
        );

        return { index: 1, choices: choices };
      }
    }
  }

  function getAllIntersections(boardArray, i) {
    return getRow(boardArray, i)
      .concat(getCol(boardArray, i))
      .concat(getBox(boardArray, i));
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = {
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
      boardIsInvalid: boardIsInvalid,
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      collectionIsValid: collectionIsValid,
      toString: toString,
    };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve, solveAndPrint: solveAndPrint };
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  function toString(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72]
      .map(function (i) {
        return getRow(boardArray, i).join(" ");
      })
      .join("\n");
  }

  return solver;
}(TESTABLE);
