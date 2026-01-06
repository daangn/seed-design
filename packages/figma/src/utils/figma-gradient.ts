/**
 * @see https://gist.github.com/yagudaev/0c2b89674c6aee8b38cd379752ef58d0
 */

const identityMatrixHandlePositions = [
  [0, 1, 0],
  [0.5, 0.5, 1],
  [1, 1, 1],
];

/**
 * Inverts a 2x3 affine transformation matrix
 * For a 2x3 matrix [[a, b, c], [d, e, f]], we treat it as a 3x3 matrix with [0, 0, 1] as the third row
 */
function inv(matrix: number[][]): number[][] {
  const [[a, b, c], [d, e, f]] = matrix;

  // Calculate determinant of the 2x2 linear part
  const det = a * e - b * d;

  if (Math.abs(det) < 1e-10) {
    throw new Error("Matrix is not invertible");
  }

  // Invert the 2x2 linear part
  const invDet = 1 / det;
  const a_inv = e * invDet;
  const b_inv = -b * invDet;
  const d_inv = -d * invDet;
  const e_inv = a * invDet;

  // Calculate the inverted translation
  const c_inv = -(a_inv * c + b_inv * f);
  const f_inv = -(d_inv * c + e_inv * f);

  return [
    [a_inv, b_inv, c_inv],
    [d_inv, e_inv, f_inv],
  ];
}

/**
 * Multiplies a 2x3 matrix with a 3x3 matrix
 * Result is a 2x3 matrix
 */
function multiply(matrix1: number[][], matrix2: number[][]): number[][] {
  const [[a, b, c], [d, e, f]] = matrix1;
  const result: number[][] = [[], []];

  // For each column in matrix2
  for (let col = 0; col < matrix2[0].length; col++) {
    // First row of result
    result[0][col] = a * matrix2[0][col] + b * matrix2[1][col] + c * matrix2[2][col];
    // Second row of result
    result[1][col] = d * matrix2[0][col] + e * matrix2[1][col] + f * matrix2[2][col];
  }

  return result;
}

export function convertTransformToGradientHandles(transform: number[][]) {
  const inverseTransform = inv(transform);

  // point matrix
  const mp = multiply(inverseTransform, identityMatrixHandlePositions);

  return [
    { x: mp[0][0], y: mp[1][0] },
    { x: mp[0][1], y: mp[1][1] },
    { x: mp[0][2], y: mp[1][2] },
  ];
}
