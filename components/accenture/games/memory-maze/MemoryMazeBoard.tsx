'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Key,
  DoorClosed,
  DoorOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
} from 'lucide-react';

import {
  MemoryMazeChallenge,
  MemoryMazeVariant,
  Point,
  arePointsEqual,
  generateMemoryMaze,
  validateMemoryMazeChallenge,
  fingerprintMemoryMazeChallenge,
} from '@/lib/accenture/games/memory-maze';
import { selectChallenge } from '@/lib/accenture/engine/challenge-selector';
import { getPersonalBest, savePersonalBest } from '@/lib/accenture/engine/score-history';
import { GameHeader } from '../GameHeader';
import { GameInstructions } from '../GameInstructions';
import { GameResults } from '../GameResults';

interface MemoryMazeBoardProps {
  variant: MemoryMazeVariant;
}

function createMazeChallenge(variant: MemoryMazeVariant): MemoryMazeChallenge {
  const result = selectChallenge({
    gameId: 'memory-maze',
    variant,
    generator: () => generateMemoryMaze(variant),
    validator: validateMemoryMazeChallenge,
    fingerprinter: fingerprintMemoryMazeChallenge,
    autoRecord: true,
  });
  return result.challenge;
}

export function MemoryMazeBoard({ variant }: MemoryMazeBoardProps) {
  // Initialize state eagerly via lazy initializer
  const [challenge, setChallenge] = useState<MemoryMazeChallenge>(() => createMazeChallenge(variant));
  const [phase, setPhase] = useState<'memorize' | 'play' | 'result'>('memorize');
  const [memorizeCountdown, setMemorizeCountdown] = useState<number>(() => challenge.memorizeSeconds);
  const [playCountdown, setPlayCountdown] = useState<number>(() => challenge.playSeconds);
  const [totalPlayTime, setTotalPlayTime] = useState<number>(() => challenge.playSeconds);

  // Player State
  const [playerPos, setPlayerPos] = useState<Point>(() => ({ ...challenge.start }));
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [wallBump, setWallBump] = useState<string | null>(null);

  // Results State
  const [gameStatus, setGameStatus] = useState<'completed' | 'timeout' | 'failed'>('completed');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [personalBest, setPersonalBest] = useState<number | null>(() => {
    const pb = getPersonalBest('memory-maze', variant);
    return pb ? pb.timeSpentSeconds : null;
  });

  // Timer reference to guarantee clean teardown and prevent multiple intervals
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wallBumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // End of game handler - declared early before timers
  const handleGameOver = useCallback(
    (status: 'completed' | 'timeout' | 'failed') => {
      clearTimer();
      setGameStatus(status);
      setPhase('result');

      const spent = totalPlayTime - playCountdown;
      setTimeSpent(spent);

      if (status === 'completed') {
        const base = 1000;
        const timeBonus = Math.max(0, playCountdown * 20);
        const mistakePenalty = mistakes * 60;
        const score = Math.max(100, base + timeBonus - mistakePenalty);
        setFinalScore(score);

        const record = {
          score,
          timeSpentSeconds: spent,
          mistakes,
          completedAt: new Date().toISOString(),
        };

        const isBest = savePersonalBest('memory-maze', variant, record);
        setIsNewBest(isBest);
        if (isBest) setPersonalBest(spent);
      } else {
        setFinalScore(0);
        setIsNewBest(false);
      }
    },
    [totalPlayTime, playCountdown, mistakes, variant, clearTimer]
  );

  // Re-roll challenge on "Play Again"
  const startNewChallenge = useCallback(() => {
    clearTimer();
    const ch = createMazeChallenge(variant);
    setChallenge(ch);
    setPlayerPos({ ...ch.start });
    setHasKey(false);
    setMistakes(0);
    setWallBump(null);
    setMemorizeCountdown(ch.memorizeSeconds);
    setPlayCountdown(ch.playSeconds);
    setTotalPlayTime(ch.playSeconds);
    setPhase('memorize');

    const pb = getPersonalBest('memory-maze', variant);
    if (pb) setPersonalBest(pb.timeSpentSeconds);
  }, [variant, clearTimer]);

  // Teardown cleanup
  useEffect(() => {
    return () => {
      clearTimer();
      if (wallBumpTimeoutRef.current) clearTimeout(wallBumpTimeoutRef.current);
    };
  }, [clearTimer]);

  // Countdown timer effect
  useEffect(() => {
    if (phase === 'memorize') {
      intervalRef.current = setInterval(() => {
        setMemorizeCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setPhase('play');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimer();
    }

    if (phase === 'play') {
      intervalRef.current = setInterval(() => {
        setPlayCountdown((prev) => {
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
    }
  }, [phase, handleGameOver, clearTimer]);

  // Movement handler
  const handleMove = useCallback(
    (dir: 'up' | 'right' | 'down' | 'left') => {
      if (phase !== 'play' || !challenge) return;

      const { grid, width, height, key, door } = challenge;
      const { x, y } = playerPos;
      const currentCell = grid[y][x];

      let targetX = x;
      let targetY = y;
      let isBlocked = false;

      if (dir === 'up') {
        if (currentCell.top || y <= 0) isBlocked = true;
        else targetY = y - 1;
      } else if (dir === 'right') {
        if (currentCell.right || x >= width - 1) isBlocked = true;
        else targetX = x + 1;
      } else if (dir === 'down') {
        if (currentCell.bottom || y >= height - 1) isBlocked = true;
        else targetY = y + 1;
      } else if (dir === 'left') {
        if (currentCell.left || x <= 0) isBlocked = true;
        else targetX = x - 1;
      }

      if (isBlocked) {
        setMistakes((prev) => prev + 1);
        setWallBump(`${x},${y}-${dir}`);
        if (wallBumpTimeoutRef.current) clearTimeout(wallBumpTimeoutRef.current);
        wallBumpTimeoutRef.current = setTimeout(() => {
          setWallBump(null);
        }, 400);
        return;
      }

      const nextPos: Point = { x: targetX, y: targetY };
      setPlayerPos(nextPos);

      let nowHasKey = hasKey;
      if (!hasKey && arePointsEqual(nextPos, key)) {
        nowHasKey = true;
        setHasKey(true);
      }

      if (arePointsEqual(nextPos, door)) {
        if (nowHasKey) {
          handleGameOver('completed');
        } else {
          setMistakes((prev) => prev + 1);
          setWallBump(`${x},${y}-door`);
          if (wallBumpTimeoutRef.current) clearTimeout(wallBumpTimeoutRef.current);
          wallBumpTimeoutRef.current = setTimeout(() => {
            setWallBump(null);
          }, 400);
        }
      }
    },
    [phase, challenge, playerPos, hasKey, handleGameOver]
  );

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'play') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleMove('up');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove('right');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleMove('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMove('left');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleMove]);

  const { width, height, grid, key, door } = challenge;
  const isMemorizePhase = phase === 'memorize';

  return (
    <div className="mx-auto flex w-full max-w-4xl px-4 py-8 sm:px-6 md:py-12 flex-col gap-6 text-[#F3EFE6]">
      {/* Game Header */}
      <GameHeader
        gameTitle="Memory Maze"
        variantName={variant.toUpperCase()}
        backUrl="/accenture/practice/memory-maze"
        timeRemaining={isMemorizePhase ? memorizeCountdown : playCountdown}
        totalTime={isMemorizePhase ? challenge.memorizeSeconds : totalPlayTime}
        phase={isMemorizePhase ? 'memorize' : 'play'}
        mistakes={phase === 'play' ? mistakes : undefined}
        personalBestTime={personalBest}
      />

      {/* Rules Accordion */}
      <GameInstructions
        bullets={[
          'Memorize the layout before the countdown expires. When gameplay begins, the walls are concealed.',
          'Navigate your token to the golden Key first to unlock the exit door.',
          'Reach the Exit Door with the Key before the timer expires to complete the assessment.',
          'Colliding with a wall or locked door counts as an error and arrests movement.',
        ]}
        controlsText="Keyboard: Arrow Keys / WASD • Touch / Mouse: Directional buttons below board"
        defaultOpen={false}
      />

      {/* Main Play Area or Results */}
      {phase === 'result' ? (
        <GameResults
          status={gameStatus}
          gameTitle="Memory Maze"
          variantName={variant.toUpperCase()}
          gameSlug="memory-maze"
          score={finalScore}
          timeSpentSeconds={timeSpent}
          timeLimitSeconds={totalPlayTime}
          mistakes={mistakes}
          isNewPersonalBest={isNewBest}
          onPlayAgain={startNewChallenge}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 border border-[#35352F] bg-[#191916] p-5 md:p-8">
          {/* Phase Banner */}
          <div className="flex w-full items-center justify-between border-b border-[#35352F] pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#C5A875]">Objective:</span>
              <span className="text-[#A7A49A] font-light">
                {isMemorizePhase
                  ? 'Inspect wall topography and chart route to Key and Exit'
                  : hasKey
                  ? 'Key acquired. Proceed to the unlocked Exit'
                  : 'Navigate to the Key node first'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isMemorizePhase ? (
                <span className="inline-flex items-center gap-1.5 border border-[#C5A875]/40 bg-[#C5A875]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#C5A875]">
                  <Eye className="h-3.5 w-3.5" />
                  Memorization Phase
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                    hasKey
                      ? 'border-[#C5A875] bg-[#C5A875]/20 text-[#C5A875]'
                      : 'border-[#35352F] bg-[#151512] text-[#858573]'
                  }`}
                >
                  <Key className="h-3.5 w-3.5" />
                  {hasKey ? 'Key Acquired' : 'Key Required'}
                </span>
              )}
            </div>
          </div>

          {/* Maze Grid Board */}
          <div
            className={`relative border-2 border-[#35352F] bg-[#151512] p-1 transition-all ${
              wallBump ? 'ring-2 ring-red-500' : ''
            }`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
              width: `${Math.min(500, width * 58)}px`,
              maxWidth: '100%',
              aspectRatio: `${width} / ${height}`,
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayerHere = playerPos.x === c && playerPos.y === r && phase === 'play';
                const isKeyHere = key.x === c && key.y === r && !hasKey;
                const isDoorHere = door.x === c && door.y === r;
                const isStartHere = challenge.start.x === c && challenge.start.y === r;
                const showWalls = isMemorizePhase;

                return (
                  <div
                    key={`${r}-${c}`}
                    className="relative flex items-center justify-center transition-colors bg-[#151512] select-none"
                    style={{
                      borderTop: showWalls && cell.top ? '2.5px solid #F3EFE6' : '1px dashed #252520',
                      borderRight: showWalls && cell.right ? '2.5px solid #F3EFE6' : '1px dashed #252520',
                      borderBottom: showWalls && cell.bottom ? '2.5px solid #F3EFE6' : '1px dashed #252520',
                      borderLeft: showWalls && cell.left ? '2.5px solid #F3EFE6' : '1px dashed #252520',
                    }}
                  >
                    {isMemorizePhase && isStartHere && (
                      <span className="font-mono text-[9px] font-bold text-[#C5A875] uppercase tracking-tighter">
                        START
                      </span>
                    )}

                    {isKeyHere && (
                      <div className="flex h-7 w-7 items-center justify-center border border-[#C5A875] bg-[#C5A875]/20 text-[#C5A875] shadow-sm animate-bounce">
                        <Key className="h-4 w-4" />
                      </div>
                    )}

                    {isDoorHere && (
                      <div
                        className={`flex h-7 w-7 items-center justify-center border shadow-sm ${
                          hasKey
                            ? 'border-[#C5A875] bg-[#C5A875] text-[#151512] animate-pulse'
                            : 'border-[#35352F] bg-[#191916] text-[#858573]'
                        }`}
                        title={hasKey ? 'Exit is Unlocked' : 'Exit is Locked'}
                      >
                        {hasKey ? <DoorOpen className="h-4 w-4" /> : <DoorClosed className="h-4 w-4" />}
                      </div>
                    )}

                    {isPlayerHere && (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#C5A875] text-[#151512] shadow-md ring-2 ring-[#C5A875]/40">
                        {hasKey ? <Sparkles className="h-4 w-4" /> : <div className="h-2.5 w-2.5 rounded-full bg-[#151512]" />}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Directional Touch Controls */}
          {phase === 'play' && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#858573]">Directional Navigation</span>
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button
                  type="button"
                  onClick={() => handleMove('up')}
                  className="flex h-11 w-11 items-center justify-center border border-[#35352F] bg-[#151512] text-[#F3EFE6] transition-transform active:scale-95 hover:border-[#C5A875] hover:text-[#C5A875]"
                  aria-label="Move Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <div />

                <button
                  type="button"
                  onClick={() => handleMove('left')}
                  className="flex h-11 w-11 items-center justify-center border border-[#35352F] bg-[#151512] text-[#F3EFE6] transition-transform active:scale-95 hover:border-[#C5A875] hover:text-[#C5A875]"
                  aria-label="Move Left"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove('down')}
                  className="flex h-11 w-11 items-center justify-center border border-[#35352F] bg-[#151512] text-[#F3EFE6] transition-transform active:scale-95 hover:border-[#C5A875] hover:text-[#C5A875]"
                  aria-label="Move Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove('right')}
                  className="flex h-11 w-11 items-center justify-center border border-[#35352F] bg-[#151512] text-[#F3EFE6] transition-transform active:scale-95 hover:border-[#C5A875] hover:text-[#C5A875]"
                  aria-label="Move Right"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
