/* --------- Constants & Helper Functions ---------- */
const BOARD_SIZE = 19;
const CELL_SIZE = 600 / (BOARD_SIZE - 1); // distance between intersection centers

/**
 * Convert board coordinates (row, col) to pixel offsets within the #board container.
 */
function boardToPixels(row, col) {
  return { x: col * CELL_SIZE, y: row * CELL_SIZE };
}

/**
 * Create a DOM element for an intersection.
 */
function createIntersection(row, col) {
  const div = document.createElement('div');
  div.classList.add('intersection');
  div.dataset.row = row;
  div.dataset.col = col;

  const { x, y } = boardToPixels(row, col);
  div.style.left = `${x}px`;
  div.style.top  = `${y}px`;

  return div;
}

/* --------- Game State ---------- */
const boardEl   = document.getElementById('board');
const boardState = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
let currentPlayer = 'black'; // human starts

/* --------- Rendering ---------- */
function renderBoard() {
  boardEl.innerHTML = ''; // clear old intersections
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const inter = createIntersection(r, c);
        if (boardState[r][c]) {
            const stone = document.createElement('div');
            stone.classList.add(boardState[r][c]); // 'black' or 'white'
            stone.classList.add('stone');         // ensure it has size
            inter.appendChild(stone);
        }
      boardEl.appendChild(inter);
    }
  }
}

// ------------------------------------------------------------------
//  Helper: Get a connected group of same‑colored stones starting at (r,c)
// ------------------------------------------------------------------
function getGroup(r, c) {
  const color = boardState[r][c];
  if (!color) return []; // empty

  const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
  const stack = [[r, c]];
  const group = [];

  while (stack.length) {
    const [cr, cc] = stack.pop();
    if (visited[cr][cc]) continue;
    visited[cr][cc] = true;

    // Only add stones of the same color
    if (boardState[cr][cc] !== color) continue;
    group.push([cr, cc]);

    // Check four neighbours
    const dirs = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr, nc = cc + dc;
      if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
        stack.push([nr, nc]);
      }
    }
  }
  return group; // array of [row,col]
}

// ------------------------------------------------------------------
//  Helper: Determine whether a group has at least one liberty
// ------------------------------------------------------------------
function hasLiberties(group) {
  for (const [r, c] of group) {
    const dirs = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (
        nr >= 0 && nr < BOARD_SIZE &&
        nc >= 0 && nc < BOARD_SIZE &&
        !boardState[nr][nc]          // Accepts '' / null / undefined
      ) {
        return true;                // found a liberty
      }
    }
  }
  return false;                     // no liberties at all
}

// ------------------------------------------------------------------
//  Helper: Remove all stones belonging to a group from the board
// ------------------------------------------------------------------
function removeGroup(group) {
  for (const [r, c] of group) {
    boardState[r][c] = null;
  }
}

// ------------------------------------------------------------------
//  After every move, look for any group with no liberties and delete it.
// ------------------------------------------------------------------
function captureGroups() {
  const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!boardState[r][c] || visited[r][c]) continue;

      const group = getGroup(r, c);
      // Mark all squares in this group as visited
      for (const [gr, gc] of group) visited[gr][gc] = true;

      if (!hasLiberties(group)) {
        removeGroup(group);          // capture!
      }
    }
  }
}


/* --------- Game Logic ---------- */
function isEmpty(row, col) {
  return boardState[row][col] === null;
}

function playMove(row, col, player) {
  if (!isEmpty(row, col)) return;   // cannot place on occupied intersection

  boardState[row][col] = player;
  renderBoard();                     // show the new stone

  captureGroups();                   // remove any dead groups
  renderBoard();                     // update board after captures
  return true;
}



/* --------- Event Handling ---------- */
boardEl.addEventListener('click', e => {
  // Find the nearest intersection element (could be a stone inside it)
  const inter = e.target.closest('.intersection');
  if (!inter) return;                    // clicked outside an intersection

  const row = parseInt(inter.dataset.row, 10);
  const col = parseInt(inter.dataset.col, 10);

  // Human move
  if (currentPlayer !== 'black') return;
  if (!playMove(row, col, 'black')) return; // invalid click

  // Simple AI: pick a random available intersection
  setTimeout(() => {
    const empties = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (isEmpty(r, c)) empties.push([r, c]);
      }
    }
    if (!empties.length) return; // board full

    const [ar, ac] = empties[Math.floor(Math.random() * empties.length)];
    playMove(ar, ac, 'white');
  }, 200); // small delay to simulate thinking
});


/* --------- Initial Render ---------- */
renderBoard();
