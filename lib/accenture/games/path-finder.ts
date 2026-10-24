/**
 * NerdMocks Accenture Practice - Path Finder
 * Procedural generation, rotation logic, edge-matching connectivity validation,
 * normalized fingerprinting, and variant configurations.
 */

import { randomInt, shuffle } from '../utils/shuffle';

export type PathFinderVariant = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';

export type TileType = 'straight' | 'corner' | 't-junction' | 'cross' | 'empty';

export interface TileConnections {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface PathTile {
  id: string;
  row: number;
  col: number;
  type: TileType;
  /** Current rotation in degrees: 0, 90, 180, 270 */
  rotation: number;
  /** Solved rotation in degrees: 0, 90, 180, 270 */
  solutionRotation: number;
  /** Base connections at 0 degrees */
  baseConnections: TileConnections;
  /** Is this tile part of the solution path? */
  isPathTile: boolean;
}

export interface PathFinderPoint {
  col: number;
  row: number;
}

export interface PathFinderChallenge {
  variant: PathFinderVariant;
  gridSize: number; // e.g. 3, 4, 5
  tiles: PathTile[][]; // [row][col]
  start: PathFinderPoint;
  end: PathFinderPoint;
  timeLimit: number; // seconds
}

export interface PathFinderVariantConfig {
  name: string;
  description: string;
  gridSize: number;
  minPathLength: number;
  timeLimit: number;
  useBranching: boolean;
}

export const PATH_FINDER_CONFIGS: Record<PathFinderVariant, PathFinderVariantConfig> = {
  beginner: {
    name: 'Beginner',
    description: '3×3 grid with direct routing and ample time to learn the mechanics.',
    gridSize: 3,
    minPathLength: 4,
    timeLimit: 60,
    useBranching: false,
  },
  easy: {
    name: 'Easy',
    description: '3×3 grid featuring turns and multiple path segments.',
    gridSize: 3,
    minPathLength: 5,
    timeLimit: 50,
    useBranching: false,
  },
  intermediate: {
    name: 'Intermediate',
    description: '4×4 grid introducing branching tiles and longer pathways.',
    gridSize: 4,
    minPathLength: 7,
    timeLimit: 50,
    useBranching: true,
  },
  advanced: {
    name: 'Advanced',
    description: '5×5 grid with complex winding routes and tight timing.',
    gridSize: 5,
    minPathLength: 10,
    timeLimit: 45,
    useBranching: true,
  },
  expert: {
    name: 'Expert',
    description: '5×5 master challenge with branching tiles, dead-end traps, and swift pace.',
    gridSize: 5,
    minPathLength: 12,
    timeLimit: 40,
    useBranching: true,
  },
};

/**
 * Returns the effective connections of a tile at a given rotation (0, 90, 180, 270).
 */
export function getRotatedConnections(base: TileConnections, rotation: number): TileConnections {
  const steps = ((rotation % 360) + 360) % 360 / 90;
  let { top, right, bottom, left } = base;

  for (let s = 0; s < steps; s++) {
    const prevTop = top;
    top = left;
    left = bottom;
    bottom = right;
    right = prevTop;
  }

  return { top, right, bottom, left };
}

/**
 * Rotates a tile 90 degrees clockwise.
 */
export function rotateTileClockwise(tile: PathTile): PathTile {
  const nextRotation = (tile.rotation + 90) % 360;
  return {
    ...tile,
    rotation: nextRotation,
  };
}

/**
 * Determines base connections and rotation for a tile connecting specified directions.
 */
function createTileFromDirections(
  directions: ('top' | 'right' | 'bottom' | 'left')[],
  allowBranching: boolean
): { type: TileType; baseConnections: TileConnections; solutionRotation: number } {
  const has = (d: 'top' | 'right' | 'bottom' | 'left') => directions.includes(d);

  if (directions.length === 2) {
    // Check if opposite (straight)
    if ((has('top') && has('bottom')) || (has('left') && has('right'))) {
      const base: TileConnections = { top: true, bottom: true, left: false, right: false };
      const solutionRotation = has('top') && has('bottom') ? 0 : 90;
      return { type: 'straight', baseConnections: base, solutionRotation };
    }
    // Corner
    const base: TileConnections = { top: true, right: true, bottom: false, left: false };
    let solutionRotation = 0;
    if (has('top') && has('right')) solutionRotation = 0;
    else if (has('right') && has('bottom')) solutionRotation = 90;
    else if (has('bottom') && has('left')) solutionRotation = 180;
    else if (has('left') && has('top')) solutionRotation = 270;
    return { type: 'corner', baseConnections: base, solutionRotation };
  }

  if (directions.length >= 3 && allowBranching) {
    // T-junction: base has top, right, bottom
    const base: TileConnections = { top: true, right: true, bottom: true, left: false };
    let solutionRotation = 0;
    if (!has('left')) solutionRotation = 0;
    else if (!has('top')) solutionRotation = 90;
    else if (!has('right')) solutionRotation = 180;
    else solutionRotation = 270;
    return { type: 't-junction', baseConnections: base, solutionRotation };
  }

  // Fallback straight
  const base: TileConnections = { top: true, bottom: true, left: false, right: false };
  return { type: 'straight', baseConnections: base, solutionRotation: 0 };
}

/**
 * Procedurally generates a solvable path on a grid.
 */
export function generatePathFinderChallenge(variant: PathFinderVariant): PathFinderChallenge {
  const config = PATH_FINDER_CONFIGS[variant] || PATH_FINDER_CONFIGS.beginner;
  const { gridSize, minPathLength, timeLimit, useBranching } = config;

  const start: PathFinderPoint = { col: 0, row: 0 };
  const end: PathFinderPoint = { col: gridSize - 1, row: gridSize - 1 };

  // Generate a random self-avoiding walk from start to end of at least minPathLength
  let path: PathFinderPoint[] = [];
  let pathAttempts = 0;

  while (pathAttempts < 200) {
    pathAttempts++;
    const candidatePath: PathFinderPoint[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.col},${start.row}`);

    let current = start;
    let found = false;

    while (true) {
      if (current.col === end.col && current.row === end.row) {
        if (candidatePath.length >= minPathLength) {
          found = true;
        }
        break;
      }

      const neighbors: PathFinderPoint[] = [
        { col: current.col, row: current.row - 1 },
        { col: current.col + 1, row: current.row },
        { col: current.col, row: current.row + 1 },
        { col: current.col - 1, row: current.row },
      ].filter(
        (p) =>
          p.col >= 0 &&
          p.col < gridSize &&
          p.row >= 0 &&
          p.row < gridSize &&
          !visited.has(`${p.col},${p.row}`)
      );

      if (neighbors.length === 0) {
        break; // Dead end
      }

      // Slightly bias toward end point if path length already long enough
      const shuffledNeighbors = shuffle(neighbors);
      const next = shuffledNeighbors[0];
      visited.add(`${next.col},${next.row}`);
      candidatePath.push(next);
      current = next;
    }

    if (found) {
      path = candidatePath;
      break;
    }
  }

  // Fallback simple path if random walk fails to reach minimum length
  if (path.length === 0) {
    path = [];
    for (let c = 0; c < gridSize; c++) path.push({ col: c, row: 0 });
    for (let r = 1; r < gridSize; r++) path.push({ col: gridSize - 1, row: r });
  }

  // Create grid of tiles
  const grid: PathTile[][] = [];
  const pathIndexMap = new Map<string, number>();
  path.forEach((p, idx) => pathIndexMap.set(`${p.col},${p.row}`, idx));

  for (let r = 0; r < gridSize; r++) {
    const rowTiles: PathTile[] = [];
    for (let c = 0; c < gridSize; c++) {
      const key = `${c},${r}`;
      const isPath = pathIndexMap.has(key);
      const id = `tile_${r}_${c}`;

      if (isPath) {
        const idx = pathIndexMap.get(key)!;
        const directions: ('top' | 'right' | 'bottom' | 'left')[] = [];

        // Connection to previous tile
        if (idx > 0) {
          const prev = path[idx - 1];
          if (prev.row < r) directions.push('top');
          else if (prev.col > c) directions.push('right');
          else if (prev.row > r) directions.push('bottom');
          else if (prev.col < c) directions.push('left');
        } else {
          // Start tile entrance (connects from left if col > 0 or top)
          directions.push('left');
        }

        // Connection to next tile
        if (idx < path.length - 1) {
          const next = path[idx + 1];
          if (next.row < r) directions.push('top');
          else if (next.col > c) directions.push('right');
          else if (next.row > r) directions.push('bottom');
          else if (next.col < c) directions.push('left');
        } else {
          // End tile exit
          directions.push('right');
        }

        const tileDef = createTileFromDirections(directions, useBranching);
        // Scramble initial rotation to a random 90-degree step
        const randomRotation = [0, 90, 180, 270][randomInt(0, 3)];

        rowTiles.push({
          id,
          row: r,
          col: c,
          type: tileDef.type,
          baseConnections: tileDef.baseConnections,
          solutionRotation: tileDef.solutionRotation,
          rotation: randomRotation,
          isPathTile: true,
        });
      } else {
        // Distractor tile
        const distractorTypes: TileType[] = useBranching
          ? ['straight', 'corner', 't-junction']
          : ['straight', 'corner'];
        const chosenType = distractorTypes[randomInt(0, distractorTypes.length - 1)];
        let baseConn: TileConnections;
        if (chosenType === 'straight') {
          baseConn = { top: true, bottom: true, left: false, right: false };
        } else if (chosenType === 'corner') {
          baseConn = { top: true, right: true, bottom: false, left: false };
        } else {
          baseConn = { top: true, right: true, bottom: true, left: false };
        }

        rowTiles.push({
          id,
          row: r,
          col: c,
          type: chosenType,
          baseConnections: baseConn,
          solutionRotation: 0,
          rotation: [0, 90, 180, 270][randomInt(0, 3)],
          isPathTile: false,
        });
      }
    }
    grid.push(rowTiles);
  }

  return {
    variant,
    gridSize,
    tiles: grid,
    start,
    end,
    timeLimit,
  };
}

/**
 * Validates edge-to-edge connectivity from Start to End for the current tile rotations.
 * Returns { isSolved: boolean, connectedCoords: Set<string> }.
 */
export function checkPathConnectivity(
  tiles: PathTile[][],
  gridSize: number,
  start: PathFinderPoint,
  end: PathFinderPoint
): { isSolved: boolean; connectedCoords: Set<string> } {
  const visited = new Set<string>();
  const queue: PathFinderPoint[] = [{ ...start }];
  visited.add(`${start.col},${start.row}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentTile = tiles[current.row][current.col];
    const currentConn = getRotatedConnections(currentTile.baseConnections, currentTile.rotation);

    // North neighbor
    if (currentConn.top && current.row > 0) {
      const neighbor = tiles[current.row - 1][current.col];
      const neighborConn = getRotatedConnections(neighbor.baseConnections, neighbor.rotation);
      if (neighborConn.bottom) {
        const key = `${current.col},${current.row - 1}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ col: current.col, row: current.row - 1 });
        }
      }
    }

    // East neighbor
    if (currentConn.right && current.col < gridSize - 1) {
      const neighbor = tiles[current.row][current.col + 1];
      const neighborConn = getRotatedConnections(neighbor.baseConnections, neighbor.rotation);
      if (neighborConn.left) {
        const key = `${current.col + 1},${current.row}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ col: current.col + 1, row: current.row });
        }
      }
    }

    // South neighbor
    if (currentConn.bottom && current.row < gridSize - 1) {
      const neighbor = tiles[current.row + 1][current.col];
      const neighborConn = getRotatedConnections(neighbor.baseConnections, neighbor.rotation);
      if (neighborConn.top) {
        const key = `${current.col},${current.row + 1}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ col: current.col, row: current.row + 1 });
        }
      }
    }

    // West neighbor
    if (currentConn.left && current.col > 0) {
      const neighbor = tiles[current.row][current.col - 1];
      const neighborConn = getRotatedConnections(neighbor.baseConnections, neighbor.rotation);
      if (neighborConn.right) {
        const key = `${current.col - 1},${current.row}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ col: current.col - 1, row: current.row });
        }
      }
    }
  }

  const isSolved = visited.has(`${end.col},${end.row}`);
  return { isSolved, connectedCoords: visited };
}

/**
 * Validates a generated Path Finder challenge.
 * Confirms that when tiles are in their solutionRotation, a valid path from Start to End exists.
 */
export function validatePathFinderChallenge(challenge: PathFinderChallenge): boolean {
  if (!challenge || !challenge.tiles || !challenge.start || !challenge.end) {
    return false;
  }

  const { gridSize, tiles, start, end } = challenge;
  if (gridSize < 3 || tiles.length !== gridSize || tiles[0]?.length !== gridSize) {
    return false;
  }

  // Create test grid with solution rotations
  const solvedTiles: PathTile[][] = tiles.map((row) =>
    row.map((tile) => ({
      ...tile,
      rotation: tile.solutionRotation,
    }))
  );

  const { isSolved } = checkPathConnectivity(solvedTiles, gridSize, start, end);
  return isSolved;
}

/**
 * Creates a normalized fingerprint for the Path Finder challenge.
 */
export function fingerprintPathFinderChallenge(challenge: PathFinderChallenge): string {
  const { variant, gridSize, start, end, tiles } = challenge;

  let tileSummary = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const t = tiles[r][c];
      tileSummary += `${t.type[0]}${t.solutionRotation / 90}`;
    }
  }

  return `PF_${variant}_${gridSize}x${gridSize}_S(${start.col},${start.row})_E(${end.col},${end.row})_${tileSummary}`;
}
