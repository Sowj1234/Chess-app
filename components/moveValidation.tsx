export function isValidPawnMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  const [fromRow, fromCol] = from.split("-").map(Number);
  const [toRow, toCol] = to.split("-").map(Number);
  const direction = movingPiece[0] === "w" ? -1 : 1; // White up, Black down
  const startRow = movingPiece[0] === "w" ? 6 : 1;

  const targetPiece = pieces[to];

  // Normal forward move
  if (fromCol === toCol) {
    if (!targetPiece && toRow === fromRow + direction) return true;

    // Double step from start position
    if (
      !targetPiece &&
      fromRow === startRow &&
      toRow === fromRow + 2 * direction &&
      !pieces[`${fromRow + direction}-${fromCol}`]
    )
      return true;
  }

  // Capture move (diagonal)
  if (
    Math.abs(fromCol - toCol) === 1 &&
    toRow === fromRow + direction &&
    targetPiece &&
    targetPiece[0] !== movingPiece[0] //capturing peice should be of oposite color
  ) {
    return true;
  }

  return false;
}

export function isValidRookMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  const [fromRow, fromCol] = from.split("-").map(Number);
  const [toRow, toCol] = to.split("-").map(Number);

  if (fromRow !== toRow && fromCol !== toCol) return false; // Only straight lines

  // Check for blocking pieces in path
  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;
    for (let c = fromCol + step; c !== toCol; c += step) {
      if (pieces[`${fromRow}-${c}`]) return false; //there is a peice in the path
    }
  } else if (fromCol === toCol) {
    const step = fromRow < toRow ? 1 : -1;
    for (let r = fromRow + step; r !== toRow; r += step) {
      if (pieces[`${r}-${fromCol}`]) return false;
    }
  }

  return true;
}

export function isValidKnightMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  const [fromRow, fromCol] = from.split("-").map(Number);
  const [toRow, toCol] = to.split("-").map(Number);

  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);

  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)))
    return false;

  const targetPiece = pieces[to];
  if (targetPiece && targetPiece[0] === movingPiece[0]) return false;

  return true;
}

export function isValidBishopMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  const [fromRow, fromCol] = from.split("-").map(Number);
  const [toRow, toCol] = to.split("-").map(Number);

  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false; // Must be diagonal

  const rowStep = fromRow < toRow ? 1 : -1;
  const colStep = fromCol < toCol ? 1 : -1;

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow && c !== toCol) {
    if (pieces[`${r}-${c}`]) return false;
    r += rowStep;
    c += colStep;
  }

  const targetPiece = pieces[to];
  if (targetPiece && targetPiece[0] === movingPiece[0]) return false;

  return true;
}

//Queen Movement (Rook + Bishop)
export function isValidQueenMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  return (
    isValidRookMove(from, to, movingPiece, pieces) ||
    isValidBishopMove(from, to, movingPiece, pieces)
  );
}

export function isValidKingMove(
  from: string,
  to: string,
  movingPiece: string,
  pieces: Record<string, string>
): boolean {
  const [fromRow, fromCol] = from.split("-").map(Number);
  const [toRow, toCol] = to.split("-").map(Number);

  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);

  if (rowDiff > 1 || colDiff > 1) return false;

  const targetPiece = pieces[to];
  if (targetPiece && targetPiece[0] === movingPiece[0]) return false;

  return true;
}
