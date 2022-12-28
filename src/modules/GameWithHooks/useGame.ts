import { useEffect, useState } from "react";

import {
  Field,
  CellState,
  generateFieldWithDefaultState,
  fieldGenerator,
  Coords,
} from "../../helpers/Field";
import { openCell } from "../../helpers/openCell";
import { setFlag } from "../../helpers/setFlag";

import { LevelNames, GameSettings } from "../../modules/GameSettings";

import { useStatus } from "./useStatus";
import { useSettings } from "./useSettings";
import { useTime } from "./useTime";

interface ReturnType {
  level: LevelNames;
  time: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  isWin: boolean;
  settings: [number, number];
  playerField: Field;
  gameField: Field;
  flagCounter: number;
  onClick: (coords: Coords) => void;
  onContextMenu: (coords: Coords) => void;
  onChangeLevel: (level: LevelNames) => void;
  onReset: () => void;
}

export const useGame = (): ReturnType => {
  const {
    settings: [size, bombs],
    level,
    setLevel,
  } = useSettings();

  const {
    isGameStarted,
    isWin,
    isGameOver,
    setNewGame,
    setInProgress,
    setGameWin,
    setGameLoose,
  } = useStatus();

  const [time, resetTime] = useTime(isGameStarted, isGameOver);

  const [flagCounter, setFlagCounter] = useState(0);

  const [playerField, setPlayerField] = useState<Field>(
    generateFieldWithDefaultState(size, CellState.hidden)
  );

  const [gameField, setGameField] = useState<Field>(
    fieldGenerator(size, bombs / (size * size))
  );

  const onClick = (coords: Coords) => {
    !isGameStarted && setInProgress();
    try {
      const [newPlayerField, isSolved] = openCell(
        coords,
        playerField,
        gameField
      );
      if (isSolved) {
        setGameWin();
      }
      setPlayerField([...newPlayerField]);
    } catch (e) {
      setPlayerField([...gameField]);
      setGameLoose();
    }
  };

  const onContextMenu = (coords: Coords) => {
    !isGameStarted && setInProgress();
    const [newPlayerField, isSolved, newFlagCounter] = setFlag(
      coords,
      playerField,
      gameField,
      flagCounter,
      bombs
    );
    setFlagCounter(newFlagCounter);
    if (isSolved) {
      setGameWin();
    }
    setPlayerField([...newPlayerField]);
  };

  const resetHandler = ([size, bombs]: [number, number]) => {
    const newGameField = fieldGenerator(size, bombs / (size * size));
    const newPlayerField = generateFieldWithDefaultState(
      size,
      CellState.hidden
    );

    setGameField([...newGameField]);
    setPlayerField([...newPlayerField]);
    setNewGame();
    resetTime();
    setFlagCounter(0);
  };

  const onChangeLevel = (level: LevelNames) => {
    const newSettings = setLevel(level);
    resetHandler(newSettings);
  };

  const onReset = () => resetHandler([size, bombs]);

  return {
    level,
    time,
    isGameOver,
    isGameStarted,
    isWin,
    settings: [size, bombs],
    playerField,
    gameField,
    flagCounter,
    onClick,
    onContextMenu,
    onChangeLevel,
    onReset,
  };
};
