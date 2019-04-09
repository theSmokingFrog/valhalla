import shortid from 'shortid';
import { Position } from './position';
import { Action } from './action';

export class Viking {
  id: string;
  level: number;
  health: number;
  kills: number;
  action: Action;
  position: Position;

  // Example Viking 'Nils'
  // {
  // "name": "Nils",
  // "level": 1,
  // "health": 2,
  // "kills": 0,
  // "action": {
  //   "order": "stop"
  // },
  // "position": {
  //   "x": 7,
  //   "y": 26
  // }

  constructor(public name: string) {
    this.id = shortid.generate();
    this.level = 1;
    this.health = 2;
    this.kills = 0;
    this.position = Position.randomWithinBoundaries();
    this.action = Action.stop();
  }

  public resetPosition() {
    this.position = Position.randomWithinBoundaries();
  }
}