const maze = [
    "######################################",
    "#       # ###      ##    ###  #      #",
    "# ### # #     ### #### #  ##  # ###  #",
    "#   # # # ##### #       #  ## # # #  #",
    "# ### #   ##    #######  # #  # # #  #",
    "#   # # # #  ## #      # # #    # #  #",
    "# ### # # # #   # #### # # # ## # #  #",
    "#   # # # # # ###    # # # #         #",
    "# # # # ### # # #### # # #   #########",
    "#   # #   # # #   ^  # # # # #       #",
    "# # # ## ## # ## ##### # # #   ##### #",
    "#   #     # #    #   # # # #####     #",
    "# #########  ##### # ##  #       #####",
    "#         ##       #    ## ####### # E",
    "######### ################ #       # #",
    "#         #            #     ####### #",
    "# ######### ###### # # # #####       #",
    "#   #   #   #      # # ### # # #######",
    "# #   #   # # #### # #               #",
    "######################################"
  ];
  /*
  
  const maze = [
    "#######E########E####################",
    "# ### #   ###### #    #     #     # E",
    "# ### ### #      #  #    #     #    #",
    "# ### # # # ###### ##################",
    "#            #       #    #   #   # #",
    "#  # ##      # ##### #  # # # # # # #",
    "#  #         #   #   #  # # # # #   #",
    "#  ######   ###  #  ### # # # # ### #",
    "#  #    #               #   #   #   #",
    "#  # ## ########   ## ###########   #",
    "#    ##          ###                #",
    "# ## #############  ###   ####   ## #",
    "#  ### ##         #  #  #           #",
    "#  #   ## ####     #    #      ###  #",
    "#  # #### #  #     #    #####       #",
    "#  #      #      ###           ##   #",
    "#  #####           #   ##   #   #   #",
    "#                                   #",
    "##################^##################"
  ];
  */
  
  const numRows = maze.length;
  const numCols = maze[0].length;
  const startChar = "^";
  const endChar = "E";
  const visited = new Array(numRows).fill(false).map(() => new Array(numCols).fill(false));
  
  const startRow = maze.findIndex(row => row.includes(startChar));
  const startCol = maze[startRow].indexOf(startChar);
  const endPositions = []; // list of all ending positions
  
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (maze[row][col] === endChar) {
        endPositions.push([row, col]);
      }
    }
  }
  
  let paths = [];
  let numExitsFound = 0;
  
  function findPath(row, col, path) {
    // Check if we have reached any of the exits
    if (endPositions.some(pos => row === pos[0] && col === pos[1])) {
      numExitsFound++;
      paths.push(path);
      if (numExitsFound === endPositions.length) { // all exits found
        return true;
      }
      return false;
    }
  
    // Check if the current cell is a valid move
    if (maze[row][col] === "#" || visited[row][col]) {
      return false;
    }
  
    // Mark the current cell as visited
    visited[row][col] = true;
  
    // Try to move in all possible directions
    if (findPath(row - 1, col, path + "U")) { // Up
      return true;
    }
    if (findPath(row, col + 1, path + "R")) { // Right
      return true;
    }
    if (findPath(row + 1, col, path + "D")) { // Down
      return true;
    }
    if (findPath(row, col - 1, path + "L")) { // Left
      return true;
    }
  
    // Unmark the current cell as visited and backtrack
    visited[row][col] = false;
    return false;
  }
  
  // Start the search from the starting position
  findPath(startRow, startCol, "");
  
  function markVisited(row, col, solvedMaze) {
      solvedMaze[row] = solvedMaze[row].slice(0, col) + '*' + solvedMaze[row].slice(col + 1);
    return solvedMaze;
  }
  
  for (let path of paths) {
    console.log(`Steps taken: ${path.length}`);
    console.log("Possible path:");
    console.log(path);
  
    let solvedMaze = maze;
    let curRow = startRow;
    let curCol = startCol;
    for (let i = 0; i < path.length - 1; i++) {
      switch (path[i]) {
        case "L":
          solvedMaze = markVisited(curRow, curCol - 1, solvedMaze);
          curCol -= 1;
          break;
        case "R":
          solvedMaze = markVisited(curRow, curCol + 1, solvedMaze);
          curCol += 1;
          break;
        case "U":
          solvedMaze = markVisited(curRow - 1, curCol, solvedMaze);
          curRow -= 1;
          break;
        case "D":
          solvedMaze = markVisited(curRow + 1, curCol, solvedMaze);
          curRow += 1;
          break;
      }
    }
    console.log(solvedMaze);
  }
  