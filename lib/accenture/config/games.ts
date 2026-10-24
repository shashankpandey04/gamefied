/**
 * NerdMocks Accenture Practice - Games Configuration
 * Central source of truth for games, variants, rules, and cognitive skill metadata.
 */

import { MEMORY_MAZE_CONFIGS } from '../games/memory-maze';
import { MATH_VARIANT_CONFIGS } from '../games/quick-fire-math';
import { PATH_FINDER_CONFIGS } from '../games/path-finder';

export interface VariantMeta {
  id: string;
  name: string;
  description: string;
  badge?: string;
  timeLimit: number;
}

export interface GameMeta {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  skillCategory: 'Spatial Memory' | 'Numerical Speed' | 'Spatial Reasoning';
  cognitiveFocus: string[];
  instructionBullets: string[];
  variants: VariantMeta[];
}

export const ACCENTURE_GAMES: Record<string, GameMeta> = {
  'memory-maze': {
    id: 'memory-maze',
    slug: 'memory-maze',
    title: 'Memory Maze',
    tagline: 'Memorize the labyrinth, navigate hidden walls, and retrieve the key.',
    description:
      'Tests spatial working memory, mental mapping, and route planning. You have a brief memorization phase to study the maze walls before they turn invisible.',
    skillCategory: 'Spatial Memory',
    cognitiveFocus: ['Working Memory', 'Mental Mapping', 'Spatial Recall', 'Error Monitoring'],
    instructionBullets: [
      'Study the maze layout during the initial memorization countdown.',
      'When the trial starts, walls are concealed. Navigate using Arrow keys, WASD, or on-screen buttons.',
      'Reach the Key first to unlock the exit door.',
      'Navigate to the Door before time runs out. Wall collisions count as mistakes.',
    ],
    variants: [
      {
        id: 'easy',
        name: MEMORY_MAZE_CONFIGS.easy.name,
        description: MEMORY_MAZE_CONFIGS.easy.description,
        badge: '5×5 Grid',
        timeLimit: MEMORY_MAZE_CONFIGS.easy.playSeconds,
      },
      {
        id: 'classic',
        name: MEMORY_MAZE_CONFIGS.classic.name,
        description: MEMORY_MAZE_CONFIGS.classic.description,
        badge: '6×6 Grid',
        timeLimit: MEMORY_MAZE_CONFIGS.classic.playSeconds,
      },
      {
        id: 'advanced',
        name: MEMORY_MAZE_CONFIGS.advanced.name,
        description: MEMORY_MAZE_CONFIGS.advanced.description,
        badge: '7×7 Grid',
        timeLimit: MEMORY_MAZE_CONFIGS.advanced.playSeconds,
      },
      {
        id: 'expert',
        name: MEMORY_MAZE_CONFIGS.expert.name,
        description: MEMORY_MAZE_CONFIGS.expert.description,
        badge: '8×8 Labyrinth',
        timeLimit: MEMORY_MAZE_CONFIGS.expert.playSeconds,
      },
    ],
  },

  'quick-fire-math': {
    id: 'quick-fire-math',
    slug: 'quick-fire-math',
    title: 'Burst the Bubble',
    tagline: 'Evaluate expressions and burst bubbles in ascending numerical order within 15 seconds.',
    description:
      'Accenture cognitive assessment developing high-speed mental calculation, relative magnitude comparison, and rapid working memory under strict 15-second time pressure.',
    skillCategory: 'Numerical Speed',
    cognitiveFocus: ['Mental Arithmetic', 'Order of Operations', 'Relative Magnitude', 'Processing Speed'],
    instructionBullets: [
      'Calculate the exact numerical value of each bubble expression.',
      'Burst bubbles in strictly ascending numerical order (smallest result to largest result).',
      'Each challenge carries a strict 15-second countdown.',
      'Adaptive difficulty dynamically adjusts problem complexity and numerical spacing as performance improves.',
    ],
    variants: [
      {
        id: 'basic',
        name: MATH_VARIANT_CONFIGS.basic.name,
        description: MATH_VARIANT_CONFIGS.basic.description,
        badge: 'Foundation • 15s Timer',
        timeLimit: MATH_VARIANT_CONFIGS.basic.timeLimit,
      },
      {
        id: 'mixed',
        name: MATH_VARIANT_CONFIGS.mixed.name,
        description: MATH_VARIANT_CONFIGS.mixed.description,
        badge: 'Mixed Ops • 15s Timer',
        timeLimit: MATH_VARIANT_CONFIGS.mixed.timeLimit,
      },
      {
        id: 'speed',
        name: MATH_VARIANT_CONFIGS.speed.name,
        description: MATH_VARIANT_CONFIGS.speed.description,
        badge: 'Compound • 15s Timer',
        timeLimit: MATH_VARIANT_CONFIGS.speed.timeLimit,
      },
    ],
  },

  'path-finder': {
    id: 'path-finder',
    slug: 'path-finder',
    title: 'Path Finder',
    tagline: 'Rotate and orient pipe tiles to construct a continuous path from Start to End.',
    description:
      'Tests spatial reasoning, visual orientation, and topological problem solving. Rotate tiles clockwise to complete an unbroken conduit.',
    skillCategory: 'Spatial Reasoning',
    cognitiveFocus: ['Mental Rotation', 'Visual Inspection', 'Path Planning', 'Topological Reasoning'],
    instructionBullets: [
      'Click or tap any tile to rotate it 90° clockwise. Keyboard navigation and spacebar are also supported.',
      'Ensure adjacent tile edges align to create an unbroken connection.',
      'Form an active line starting from the top-left green terminal to the bottom-right blue goal.',
      'Once an unbroken continuous pathway is achieved, the assessment registers completion immediately.',
    ],
    variants: [
      {
        id: 'beginner',
        name: PATH_FINDER_CONFIGS.beginner.name,
        description: PATH_FINDER_CONFIGS.beginner.description,
        badge: '3×3 Grid • Linear',
        timeLimit: PATH_FINDER_CONFIGS.beginner.timeLimit,
      },
      {
        id: 'easy',
        name: PATH_FINDER_CONFIGS.easy.name,
        description: PATH_FINDER_CONFIGS.easy.description,
        badge: '3×3 Grid • Multi-turn',
        timeLimit: PATH_FINDER_CONFIGS.easy.timeLimit,
      },
      {
        id: 'intermediate',
        name: PATH_FINDER_CONFIGS.intermediate.name,
        description: PATH_FINDER_CONFIGS.intermediate.description,
        badge: '4×4 Grid • Branching',
        timeLimit: PATH_FINDER_CONFIGS.intermediate.timeLimit,
      },
      {
        id: 'advanced',
        name: PATH_FINDER_CONFIGS.advanced.name,
        description: PATH_FINDER_CONFIGS.advanced.description,
        badge: '5×5 Grid • Complex',
        timeLimit: PATH_FINDER_CONFIGS.advanced.timeLimit,
      },
      {
        id: 'expert',
        name: PATH_FINDER_CONFIGS.expert.name,
        description: PATH_FINDER_CONFIGS.expert.description,
        badge: '5×5 Grid • Master',
        timeLimit: PATH_FINDER_CONFIGS.expert.timeLimit,
      },
    ],
  },
};

export function isValidGameSlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(ACCENTURE_GAMES, slug);
}

export function isValidVariant(gameSlug: string, variant: string): boolean {
  const game = ACCENTURE_GAMES[gameSlug];
  if (!game) return false;
  return game.variants.some((v) => v.id === variant);
}
