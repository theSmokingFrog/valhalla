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

  public heal(): void {
    if (this.health < this.maximumHealth) {
      this.health = this.health + this.level;
    }
    if (this.health > this.maximumHealth) {
      this.health = this.maximumHealth;
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
      this.position = this.position.withRelative(this.action.position);
    } else {
      // nothing happens cause the field is blocked!
    }
  }

  public attack(targetViking: Viking) {
    if (targetViking) {
      targetViking.injure(this.level);
      if (targetViking.isDead()) {
        this.kills++;
      }
    }
  }

  public injure(level: number): void {
    this.health = this.health - level;
  }
}