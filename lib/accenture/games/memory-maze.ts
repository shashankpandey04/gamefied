/**
 * NerdMocks Accenture Practice - Memory Maze
 * Procedural generation with recursive backtracking, BFS reachability validation,
 * normalized fingerprinting, and variant configurations.
 */

import { randomInt, shuffle } from '../utils/shuffle';

export type MemoryMazeVariant = 'easy' | 'classic' | 'advanced' | 'expert';

export interface MazeCell {
  x: number;
  y: number;
  // Wall presence
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface MemoryMazeChallenge {
  variant: MemoryMazeVariant;
  width: number;
  height: number;
  grid: MazeCell[][]; // [y][x]
  start: Point;
  key: Point;
  door: Point;
  memorizeSeconds: number;
  playSeconds: number;
}

export interface MemoryMazeVariantConfig {
  name: string;
  description: string;
  width: number;
  height: number;
  memorizeSeconds: number;
  playSeconds: number;
  minKeyDistance: number;
  minDoorDistance: number;
}

export const MEMORY_MAZE_CONFIGS: Record<MemoryMazeVariant, MemoryMazeVariantConfig> = {
  easy: {
    name: 'Easy',
    description: '5×5 grid with gentle paths and longer memorization window.',
    width: 5,
    height: 5,
    memorizeSeconds: 8,
    playSeconds: 45,
    minKeyDistance: 4,
    minDoorDistance: 4,
  },
  classic: {
    name: 'Classic',
    description: '6×6 grid with standard branching passages and balanced timer.',
    width: 6,
    height: 6,
    memorizeSeconds: 6,
    playSeconds: 40,
    minKeyDistance: 5,
    minDoorDistance: 5,
  },
  advanced: {
    name: 'Advanced',
    description: '7×7 grid featuring intricate corridors and tighter time constraints.',
    width: 7,
    height: 7,
    memorizeSeconds: 5,
    playSeconds: 35,
    minKeyDistance: 6,
    minDoorDistance: 6,
  },
  expert: {
    name: 'Expert',
    description: '8×8 complex labyrinth demanding instant recall and rapid execution.',
    width: 8,
    height: 8,
    memorizeSeconds: 4,
    playSeconds: 30,
    minKeyDistance: 7,
    minDoorDistance: 7,
  },
};

/**
 * Checks if two points are equal.
 */
export function arePointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Finds shortest path distance between start and target in the maze using BFS.
 * Returns -1 if unreachable.
 */
export function getShortestPathDistance(
  grid: MazeCell[][],
  width: number,
  height: number,
  start: Point,
  target: Point
): number {
  if (arePointsEqual(start, target)) return 0;

  const queue: { x: number; y: number; dist: number }[] = [{ ...start, dist: 0 }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === target.x && current.y === target.y) {
      return current.dist;
    }

    const cell = grid[current.y][current.x];
    const neighbors: { x: number; y: number; canMove: boolean }[] = [
      { x: current.x, y: current.y - 1, canMove: !cell.top },
      { x: current.x + 1, y: current.y, canMove: !cell.right },
      { x: current.x, y: current.y + 1, canMove: !cell.bottom },
      { x: current.x - 1, y: current.y, canMove: !cell.left },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.canMove &&
        neighbor.x >= 0 &&
        neighbor.x < width &&
        neighbor.y >= 0 &&
        neighbor.y < height
      ) {
        const key = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ x: neighbor.x, y: neighbor.y, dist: current.dist + 1 });
        }
      }
    }
  }

  return -1;
}

/**
 * Procedurally carves a maze using randomized recursive backtracking with optional loop additions
 * to make paths more interesting.
 */
export function generateMemoryMaze(variant: MemoryMazeVariant): MemoryMazeChallenge {
  const config = MEMORY_MAZE_CONFIGS[variant] || MEMORY_MAZE_CONFIGS.easy;
  const { width, height } = config;

  // Initialize all walls present
  const grid: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: MazeCell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ x, y, top: true, right: true, bottom: true, left: true });
    }
    grid.push(row);
  }

  // Recursive Backtracker algorithm
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const stack: Point[] = [];

  const startX = randomInt(0, 1);
  const startY = randomInt(0, 1);
  visited[startY][startX] = true;
  stack.push({ x: startX, y: startY });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y } = current;

    const unvisitedNeighbors: { x: number; y: number; dir: 'top' | 'right' | 'bottom' | 'left' }[] = [];
    if (y > 0 && !visited[y - 1][x]) unvisitedNeighbors.push({ x, y: y - 1, dir: 'top' });
    if (x < width - 1 && !visited[y][x + 1]) unvisitedNeighbors.push({ x: x + 1, y, dir: 'right' });
    if (y < height - 1 && !visited[y + 1][x]) unvisitedNeighbors.push({ x, y: y + 1, dir: 'bottom' });
    if (x > 0 && !visited[y][x - 1]) unvisitedNeighbors.push({ x: x - 1, y, dir: 'left' });

    if (unvisitedNeighbors.length > 0) {
      const chosen = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
      // Remove wall between current and chosen
      if (chosen.dir === 'top') {
        grid[y][x].top = false;
        grid[chosen.y][chosen.x].bottom = false;
      } else if (chosen.dir === 'right') {
        grid[y][x].right = false;
        grid[chosen.y][chosen.x].left = false;
      } else if (chosen.dir === 'bottom') {
        grid[y][x].bottom = false;
        grid[chosen.y][chosen.x].top = false;
      } else if (chosen.dir === 'left') {
        grid[y][x].left = false;
        grid[chosen.y][chosen.x].right = false;
      }

      visited[chosen.y][chosen.x] = true;
      stack.push({ x: chosen.x, y: chosen.y });
    } else {
      stack.pop();
    }
  }

  // Optionally remove a few extra walls (braid maze slightly for extra path alternatives)
  const extraOpenings = Math.floor(width / 2);
  for (let i = 0; i < extraOpenings; i++) {
    const rx = randomInt(1, width - 2);
    const ry = randomInt(1, height - 2);
    if (Math.random() > 0.5) {
      grid[ry][rx].right = false;
      grid[ry][rx + 1].left = false;
    } else {
      grid[ry][rx].bottom = false;
      grid[ry + 1][rx].top = false;
    }
  }

  const start: Point = { x: 0, y: 0 };

  // Collect candidate points with distances from Start
  const candidateCells: { point: Point; distFromStart: number }[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === start.x && y === start.y) continue;
      const dist = getShortestPathDistance(grid, width, height, start, { x, y });
      if (dist >= config.minKeyDistance) {
        candidateCells.push({ point: { x, y }, distFromStart: dist });
      }
    }
  }

  // Pick key from candidate cells
  let key: Point;
  let door: Point;

  if (candidateCells.length > 0) {
    const shuffledCandidates = shuffle(candidateCells);
    key = shuffledCandidates[0].point;

    // Pick door that is separated from both start and key
    const doorCandidates = candidateCells
      .filter((c) => !arePointsEqual(c.point, key))
      .map((c) => ({
        point: c.point,
        distFromKey: getShortestPathDistance(grid, width, height, key, c.point),
      }))
      .filter((c) => c.distFromKey >= Math.max(2, Math.floor(config.minDoorDistance / 2)));

    if (doorCandidates.length > 0) {
      const sortedDoorCandidates = [...doorCandidates].sort((a, b) => b.distFromKey - a.distFromKey);
      door = sortedDoorCandidates[0].point;
    } else {
      door = { x: width - 1, y: height - 1 };
    }
  } else {
    // Fallback placement
    key = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    door = { x: width - 1, y: height - 1 };
  }

  return {
    variant,
    width,
    height,
    grid,
    start,
    key,
    door,
    memorizeSeconds: config.memorizeSeconds,
    playSeconds: config.playSeconds,
  };
}

/**
 * Validates a generated Memory Maze challenge.
 * Confirms non-empty grid, distinct start/key/door, and valid routes Start -> Key -> Door.
 */
export function validateMemoryMazeChallenge(challenge: MemoryMazeChallenge): boolean {
  if (!challenge || !challenge.grid || !challenge.start || !challenge.key || !challenge.door) {
    return false;
  }

  const { width, height, grid, start, key, door } = challenge;
  if (width < 3 || height < 3) return false;
  if (grid.length !== height || grid[0]?.length !== width) return false;

  // Distinct entities
  if (arePointsEqual(start, key) || arePointsEqual(key, door) || arePointsEqual(start, door)) {
    return false;
  }

  // Bounds check
  const inBounds = (p: Point) => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height;
  if (!inBounds(start) || !inBounds(key) || !inBounds(door)) return false;

  // Path reachability check: Start -> Key
  const startToKeyDist = getShortestPathDistance(grid, width, height, start, key);
  if (startToKeyDist <= 0) return false;

  // Path reachability check: Key -> Door
  const keyToDoorDist = getShortestPathDistance(grid, width, height, key, door);
  if (keyToDoorDist <= 0) return false;

  return true;
}

/**
 * Creates a normalized fingerprint of the maze challenge.
 */
export function fingerprintMemoryMazeChallenge(challenge: MemoryMazeChallenge): string {
  const { variant, width, height, start, key, door, grid } = challenge;

  // Encode walls as a bit sequence: each cell's right and bottom walls
  let wallBits = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      wallBits += (cell.right ? '1' : '0') + (cell.bottom ? '1' : '0');
    }
  }

  return `MM_${variant}_${width}x${height}_S(${start.x},${start.y})_K(${key.x},${key.y})_D(${door.x},${door.y})_${wallBits}`;
}
