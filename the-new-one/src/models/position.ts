import { GameConfig } from '../config';

export class Position {
  public x: number;
  public y: number;

  private constructor() {
  }

  public static randomWithinBoundaries() {
    const position = new Position();

    position.x = Position.randomNumberInRange(0, GameConfig.MAP_BOUNDARY_X);
    position.y = Position.randomNumberInRange(0, GameConfig.MAP_BOUNDARY_Y);

    return position;
  }

  private static randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static validateMoveOrAttackPosition(position: Position): boolean {
    let isValid = false;
    if (position != null) {
      if ((position.x === 0 || position.x === 1 || position.x === -1) && (position.y === 0 || position.y === 1 || position.x === -1)) {
        isValid = true;
      }
    }
    return isValid;
  }

  public withRelative(pPosition: Position): Position {
    const result = new Position();
    result.y = this.y + pPosition.y;
    result.x = this.x + pPosition.x;
    return result;
  }
}