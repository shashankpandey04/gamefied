'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCw,
  Zap,
  Flag,
} from 'lucide-react';

import {
  PathFinderChallenge,
  PathFinderVariant,
  PathTile,
  checkPathConnectivity,
  getRotatedConnections,
  rotateTileClockwise,
  generatePathFinderChallenge,
  validatePathFinderChallenge,
  fingerprintPathFinderChallenge,
} from '@/lib/accenture/games/path-finder';
import { selectChallenge } from '@/lib/accenture/engine/challenge-selector';
import { getPersonalBest, savePersonalBest } from '@/lib/accenture/engine/score-history';
import { GameHeader } from '../GameHeader';
import { GameInstructions } from '../GameInstructions';
import { GameResults } from '../GameResults';

interface PathFinderBoardProps {
  variant: PathFinderVariant;
}

function createPathChallenge(variant: PathFinderVariant): PathFinderChallenge {
  const result = selectChallenge({
    gameId: 'path-finder',
    variant,
    generator: () => generatePathFinderChallenge(variant),
    validator: validatePathFinderChallenge,
    fingerprinter: fingerprintPathFinderChallenge,
    autoRecord: true,
  });
  return result.challenge;
}

export function PathFinderBoard({ variant }: PathFinderBoardProps) {
  // Lazy state initialization
  const [challenge, setChallenge] = useState<PathFinderChallenge>(() => createPathChallenge(variant));
  const [tiles, setTiles] = useState<PathTile[][]>(() => challenge.tiles);
  const [connectedSet, setConnectedSet] = useState<Set<string>>(() => {
    const { connectedCoords } = checkPathConnectivity(
      challenge.tiles,
      challenge.gridSize,
      challenge.start,
      challenge.end
    );
    return connectedCoords;
  });
  const [rotationsCount, setRotationsCount] = useState<number>(0);
  const [focusedCoord, setFocusedCoord] = useState<{ r: number; c: number }>({ r: 0, c: 0 });

  // Timer & Results State
  const [phase, setPhase] = useState<'play' | 'result'>('play');
  const [countdown, setCountdown] = useState<number>(() => challenge.timeLimit);
  const [totalTime, setTotalTime] = useState<number>(() => challenge.timeLimit);
  const [gameStatus, setGameStatus] = useState<'completed' | 'timeout' | 'failed'>('completed');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [personalBest, setPersonalBest] = useState<number | null>(() => {
    const pb = getPersonalBest('path-finder', variant);
    return pb ? pb.timeSpentSeconds : null;
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // End of game handler - declared before timers
  const handleGameOver = useCallback(
    (status: 'completed' | 'timeout' | 'failed', finalRotations?: number) => {
      clearTimer();
      setGameStatus(status);
      setPhase('result');

      const spent = totalTime - countdown;
      setTimeSpent(spent);

      const rCount = typeof finalRotations === 'number' ? finalRotations : rotationsCount;

      if (status === 'completed') {
        const base = 1000;
        const speedBonus = Math.max(0, countdown * 20);
        const efficiencyPenalty = Math.max(0, (rCount - 15) * 15);
        const score = Math.max(100, base + speedBonus - efficiencyPenalty);
        setFinalScore(score);

        const record = {
          score,
          timeSpentSeconds: spent,
          mistakes: 0,
          completedAt: new Date().toISOString(),
        };

        const isBest = savePersonalBest('path-finder', variant, record);
        setIsNewBest(isBest);
        if (isBest) setPersonalBest(spent);
      } else {
        setFinalScore(0);
        setIsNewBest(false);
      }
    },
    [totalTime, countdown, rotationsCount, variant, clearTimer]
  );

  // Re-roll challenge on "Play Again"
  const startNewChallenge = useCallback(() => {
    clearTimer();
    const ch = createPathChallenge(variant);
    setChallenge(ch);
    setTiles(ch.tiles);
    setCountdown(ch.timeLimit);
    setTotalTime(ch.timeLimit);
    setRotationsCount(0);
    setFocusedCoord({ r: 0, c: 0 });
    setPhase('play');

    const { connectedCoords } = checkPathConnectivity(ch.tiles, ch.gridSize, ch.start, ch.end);
    setConnectedSet(connectedCoords);

    const pb = getPersonalBest('path-finder', variant);
    if (pb) setPersonalBest(pb.timeSpentSeconds);
  }, [variant, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Handle countdown interval
  useEffect(() => {
    if (phase !== 'play') return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          handleGameOver('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, handleGameOver, clearTimer]);

  // Rotate a specific tile
  const handleTileClick = useCallback(
    (r: number, c: number) => {
      if (phase !== 'play' || !challenge) return;

      const currentTile = tiles[r][c];
      const rotated = rotateTileClockwise(currentTile);

      const nextTiles = tiles.map((row, rowIdx) =>
        rowIdx === r ? row.map((tile, colIdx) => (colIdx === c ? rotated : tile)) : row
      );

      const nextRotations = rotationsCount + 1;
      setRotationsCount(nextRotations);
      setTiles(nextTiles);
      setFocusedCoord({ r, c });

      const { isSolved, connectedCoords } = checkPathConnectivity(
        nextTiles,
        challenge.gridSize,
        challenge.start,
        challenge.end
      );

      setConnectedSet(connectedCoords);

      if (isSolved) {
        handleGameOver('completed', nextRotations);
      }
    },
    [phase, challenge, tiles, rotationsCount, handleGameOver]
  );

  // Keyboard navigation across grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'play' || !challenge) return;

      const { gridSize } = challenge;
      const { r, c } = focusedCoord;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedCoord({ r: Math.max(0, r - 1), c });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedCoord({ r: Math.min(gridSize - 1, r + 1), c });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedCoord({ r, c: Math.max(0, c - 1) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedCoord({ r, c: Math.min(gridSize - 1, c + 1) });
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTileClick(r, c);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, challenge, focusedCoord, handleTileClick]);

  const { gridSize, start, end } = challenge;

  return (
    <div className="mx-auto flex w-full max-w-4xl px-4 py-8 sm:px-6 md:py-12 flex-col gap-6 text-[#F3EFE6]">
      {/* Game Header */}
      <GameHeader
        gameTitle="Path Finder"
        variantName={variant.toUpperCase()}
        backUrl="/accenture/practice/path-finder"
        timeRemaining={countdown}
        totalTime={totalTime}
        phase="play"
        mistakes={rotationsCount}
        personalBestTime={personalBest}
      />

      {/* Rules */}
      <GameInstructions
        bullets={[
          'Rotate tiles to build an unbroken active conduit between the Start terminal and End terminal.',
          'Each click/tap rotates the tile 90° clockwise. The active power signal immediately illuminates connected segments.',
          'When an unbroken continuous route connects Start to End, the puzzle completes automatically.',
          'Straight passages, curved elbows, and branching intersections must match opposing edges to conduct signal.',
        ]}
        controlsText="Click/Tap to rotate • Arrow Keys to select tile • Space/Enter to rotate"
        defaultOpen={false}
      />

      {/* Main Play Area or Results */}
      {phase === 'result' ? (
        <GameResults
          status={gameStatus}
          gameTitle="Path Finder"
          variantName={variant.toUpperCase()}
          gameSlug="path-finder"
          score={finalScore}
          timeSpentSeconds={timeSpent}
          timeLimitSeconds={totalTime}
          mistakes={rotationsCount}
          isNewPersonalBest={isNewBest}
          onPlayAgain={startNewChallenge}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 border border-[#35352F] bg-[#191916] p-5 md:p-8">
          {/* Status Bar */}
          <div className="flex w-full items-center justify-between border-b border-[#35352F] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#C5A875]">Network Status:</span>
              <span className="text-[#A7A49A] font-light">
                {connectedSet.size} conduits powered • {rotationsCount} rotations logged
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 border border-[#C5A875]/40 bg-[#C5A875]/10 px-2.5 py-1 font-mono text-[10px] text-[#C5A875]">
                <Zap className="h-3 w-3" />
                {gridSize}×{gridSize} Matrix
              </span>
            </div>
          </div>

          {/* Path Puzzle Grid */}
          <div
            className="grid gap-2 border-2 border-[#35352F] bg-[#151512] p-3 shadow-inner select-none"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              width: `${Math.min(520, gridSize * 85)}px`,
              maxWidth: '100%',
              aspectRatio: '1 / 1',
            }}
          >
            {tiles.map((row, r) =>
              row.map((tile, c) => {
                const isStart = start.row === r && start.col === c;
                const isEnd = end.row === r && end.col === c;
                const isConnected = connectedSet.has(`${c},${r}`);
                const isFocused = focusedCoord.r === r && focusedCoord.c === c;
                const conn = getRotatedConnections(tile.baseConnections, tile.rotation);

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => handleTileClick(r, c)}
                    className={`group relative flex items-center justify-center transition-all outline-none focus-visible:ring-1 focus-visible:ring-[#C5A875] ${
                      isConnected
                        ? 'bg-[#151512] border-2 border-[#C5A875] shadow-sm'
                        : 'bg-[#191916] border border-[#35352F] hover:border-[#858573]'
                    } ${isFocused ? 'ring-1 ring-[#C5A875]' : ''}`}
                    title={`Row ${r + 1}, Col ${c + 1} - Click to rotate`}
                  >
                    {/* Terminal Badges */}
                    {isStart && (
                      <div className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center border border-[#C5A875] bg-[#C5A875] text-[#151512] shadow-sm z-10 font-mono text-[9px] font-bold">
                        A
                      </div>
                    )}

                    {isEnd && (
                      <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center border border-[#F3EFE6] bg-[#151512] text-[#C5A875] shadow-sm z-10 font-mono text-[9px] font-bold">
                        <Flag className="h-3 w-3" />
                      </div>
                    )}

                    {/* SVG Tile Pipe Rendering */}
                    <svg viewBox="0 0 100 100" className="h-full w-full p-1.5">
                      {/* Pipe Background Hub */}
                      <circle
                        cx="50"
                        cy="50"
                        r="12"
                        className={isConnected ? 'fill-[#C5A875]' : 'fill-[#35352F]'}
                      />

                      {/* North Pipe */}
                      {conn.top && (
                        <rect
                          x="42"
                          y="0"
                          width="16"
                          height="50"
                          rx="2"
                          className={isConnected ? 'fill-[#C5A875]' : 'fill-[#35352F]'}
                        />
                      )}

                      {/* East Pipe */}
                      {conn.right && (
                        <rect
                          x="50"
                          y="42"
                          width="50"
                          height="16"
                          rx="2"
                          className={isConnected ? 'fill-[#C5A875]' : 'fill-[#35352F]'}
                        />
                      )}

                      {/* South Pipe */}
                      {conn.bottom && (
                        <rect
                          x="42"
                          y="50"
                          width="16"
                          height="50"
                          rx="2"
                          className={isConnected ? 'fill-[#C5A875]' : 'fill-[#35352F]'}
                        />
                      )}

                      {/* West Pipe */}
                      {conn.left && (
                        <rect
                          x="0"
                          y="42"
                          width="50"
                          height="16"
                          rx="2"
                          className={isConnected ? 'fill-[#C5A875]' : 'fill-[#35352F]'}
                        />
                      )}

                      {/* Active Current Glow */}
                      {isConnected && (
                        <circle
                          cx="50"
                          cy="50"
                          r="5"
                          className="fill-[#F3EFE6] animate-pulse"
                        />
                      )}
                    </svg>

                    {/* Mini Rotation Hint on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <RotateCw className="h-4 w-4 text-[#C5A875]" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-5 font-mono text-[11px] text-[#858573]">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-[#C5A875]" />
              <span>Source Alpha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 border border-[#F3EFE6]" />
              <span>Goal Omega</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-5 bg-[#C5A875]" />
              <span>Conducting Path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
