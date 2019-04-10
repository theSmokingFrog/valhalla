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

  public levelUp(): void {
    if (this.kills > Math.pow(2, this.level - 1)) {
      this.level += 1;
      this.kills = 0;
      this.heal();
    }
  }

  public increaseHealth(): void {

  }

  public heal(): void {
    if (this.health < this.maximumHealth) {
      this.health = this.health + this.level;
    }
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  public get maximumHealth() {
    return this.level * 2;
  }

  public respawnAtRandomPosition() {
    this.position = Position.randomWithinBoundaries();
  }

  public doNothing() {
    this.action = Action.stop();
  }

  public move(otherViking: Viking) {
    if (!otherViking) {
      this.position.withRelative(this.action.position);
    } else {
      // nothing happens cause the field is blocked!
    }
  }
}