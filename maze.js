// Select necessary elements from the DOM
const mazeFileInput = document.getElementById('maze-file');
const mainWrapper = document.getElementById('main-wrapper');
const mazeContainer = document.getElementById('maze-container');
const btnSolve = document.getElementById('btn-solve');
const pathWrapper = document.getElementById('path-wrapper');

// Initialize maze variable to null
let maze = null;

function resetMaze() {
  maze = null;
  btnSolve.classList.remove('disabled');
  mainWrapper.classList.add('hide');
  mazeContainer.innerHTML = '';
  pathWrapper.innerHTML = '';
}

// Listen for changes to the file input
mazeFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    resetMaze();
    let fileContent = event.target.result;

    // Split the file content by newline to get the maze
    maze = fileContent.split('\n');

    // Remove any empty strings from the end of the array
    while (maze.length > 0 && maze[maze.length - 1] === '') {
      maze.pop();
    }

    // Add the maze to the page
    createMaze(maze);

    // Show the main wrapper element
    mainWrapper.classList.remove('hide');
  };
  reader.onerror = (event) => {
    console.error(`Failed to read the file: ${event.target.error}`);
  };
  reader.readAsText(file);
});

function createMaze(maze) {
  // Create the first row of the maze
  const firstRow = document.createElement('div');
  const emptyCell = document.createElement('span');
  firstRow.appendChild(emptyCell);
  for (let j = 0; j < maze[0].length; j++) {
    const cell = document.createElement('span');
    cell.textContent = j;
    firstRow.appendChild(cell);
  }
  mazeContainer.appendChild(firstRow);

  // Create the rest of the maze
  for (let i = 0; i < maze.length; i++) {
    const row = document.createElement('div');
    const cell = document.createElement('span');
    cell.textContent = i;
    row.appendChild(cell);
    for (let j = 0; j < maze[i].length; j++) {
      const cell = document.createElement('span');
      cell.textContent = maze[i][j];
      row.appendChild(cell);
    }
    mazeContainer.appendChild(row);
  }
}

function solveMaze() {
  if (maze) {
    btnSolve.classList.add('disabled');
    const numRows = maze.length;
    const numCols = maze[0].length;
    const startChar = '^';
    const endChar = 'E';
    const visited = new Array(numRows).fill(false).map(() => new Array(numCols).fill(false));

    // Find the starting position in the maze
    const startRow = maze.findIndex((row) => row.includes(startChar));
    const startCol = maze[startRow].indexOf(startChar);

    // Find all ending positions in the maze
    const endPositions = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (maze[row][col] === endChar) {
          endPositions.push([row, col]);
        }
      }
    }

    // Find all paths to the end positions
    const paths = [];
    let numExitsFound = 0;

    // Check if a move is valid
    function isValidMove(row, col) {
      return row >= 0 && row < numRows && col >= 0 && col < numCols && maze[row][col] !== '#';
    }

    function bfs() {
      const queue = [];
      queue.push({ row: startRow, col: startCol, path: [], steps: 0 });

      while (queue.length > 0) {
        const current = queue.shift();
        const { row, col, path, steps } = current;

        // Check if an exit was reached
        if (endPositions.some(pos => row === pos[0] && col === pos[1])) {
          paths.push({ path, steps });
          numExitsFound++;
          if (numExitsFound === endPositions.length) {
            break;
          }
        }

        visited[row][col] = true;

        // Directions of all neighboring cells
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dRow, dCol] of directions) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (isValidMove(newRow, newCol) && !visited[newRow][newCol]) {
            queue.push({
              row: newRow,
              col: newCol,
              path: [...path, ([newRow, newCol])],
              steps: steps + 1
            });
            visited[newRow][newCol] = true;
          }
        }
      }
    }

    bfs();

    // Generate solutions of possible paths
    for (let i = 0; i < numExitsFound; i++) {
      animatePaths(startRow, startCol, paths[i].path);
      generatePaths(i, paths[i]);
    }
  }
}

function generatePaths(index, paths) {
  const { path, steps } = paths;
  const pathContainer = document.createElement('div');
  pathContainer.classList.add('path-container')

  const endPath = document.createElement('div');
  const endStep = document.createElement('div');
  // Set text content of path and steps
  endPath.textContent = `Path to exit ${index + 1}: ${path.map(p => `(${p[0]},${p[1]})`)}`
  endStep.textContent = `Steps to exit ${index + 1}: ${steps}`
  pathContainer.appendChild(endPath);
  pathContainer.appendChild(endStep);
  pathWrapper.appendChild(pathContainer);
}

function animatePaths(startRow, startCol, path) {
  // Animate entrance
  const cell = mazeContainer.children[startRow + 1].children[startCol + 1];
  cell.classList.add("maze-entrance");

  for (let i = 0; i < path.length; i++) {
    const [row, col] = path[i];
    const cell = mazeContainer.children[row + 1].children[col + 1];

    if (i === path.length - 1) { // Animate exit
      cell.classList.add("maze-exit");
    } else { // Animate path
      setTimeout(() => {
        cell.textContent = '*';
        cell.classList.add("maze-path");
      }, i * 100);
    }
  }
}