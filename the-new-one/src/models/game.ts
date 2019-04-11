import { Viking } from './viking';
import { Position } from './position';
import { Action } from './action';
import * as _ from 'lodash';
import { Order } from './order';
import { GameConfig } from '../config';

export class Game {
  private gameStarted: boolean = false;
  private gameRoundRunning: boolean = false;
  private gameRound: number = 1;
  private vikings: Viking[] = [];

  constructor() {
  }

  public start() {
    console.log(`Let's get the game started...`);
    this.gameStarted = true;
    setInterval(() => this.eventuallyTriggerGameRound(), GameConfig.ROUND_TIMEOUT_IN_MS);
  }

  private eventuallyTriggerGameRound(): void {
    if (!this.gameRoundRunning) {
      this.triggerGameRound();
    } else {
      console.log(`Round #${this.gameRound} is still running; waiting again`);
    }
  }

  private triggerGameRound(): void {
    console.log(`Starting: Round #${this.gameRound}`);
    this.gameRoundRunning = true;

    this.doGameRound();

    this.gameRoundRunning = false;
    console.log(`Finished: Round #${this.gameRound++}`);
  }

  private doGameRound() {
    // Fixme: This is actually not helpful at all! While leading to a situation where a viking is really only able
    // execute one action, there is no possibility to submit actions. You have to exactly hit the time window after
    // one round is finished until the beginng of the next
    // The Concept in the original implementation allowed quick algorithms the execution of multiple actions per round
    // const gamestate: Viking[] = this.allVikings();

    // 1. Execute Order 'Attack'
    this.vikings.filter(viking => viking.action.order === Order.ATTACK).forEach(viking => viking.attack(this.vikingByRelativePosition(viking)));
    // 2. get rid of the dead Vikings
    const deadVikingIds = this.vikings.filter(viking => viking.isDead()).map(viking => viking.id);
    _.remove(this.vikings, (viking => deadVikingIds.some(id => id === viking.id)));
    // 3. Level up the remaining vikings
    this.vikings.forEach(viking => viking.levelUp());
    // 4. Execute Order 'Move'
    this.vikings.filter(viking => viking.action.order === Order.MOVE).forEach(viking => viking.move(this.vikingByRelativePosition(viking)));
    // 5. Execute Order 'Heal'
    this.vikings.filter(viking => viking.action.order === Order.HEAL).forEach(viking => viking.heal());
    // 6. Reset all Orders to 'Stop'
    this.vikings.forEach(viking => viking.doNothing());

    // this.vikings = gamestate;
  }

  public setActionForViking(id: string, action: Action): Viking {
    const vikingToUpdate = this.vikingById(id);
    if (vikingToUpdate) {
      vikingToUpdate.action = action;
    }
    return vikingToUpdate;
  }

  public createNewViking(name: string): Viking {
    const vikingToAdd = new Viking(name);
    let maxPositionRetries: number = 10;

    while (this.vikingByPosition(vikingToAdd.position) && maxPositionRetries--) {
      vikingToAdd.respawnAtRandomPosition();
    }

    if (this.vikingByPosition(vikingToAdd.position) && maxPositionRetries === 0) {
      throw new Error('Could not create Viking');
    }

    this.vikings.push(vikingToAdd);
    return vikingToAdd;
  }

  public vikingById(id: string): Viking {
    return this.vikings.find(viking => viking.id === id);
  }

  public vikingByPosition(pPosition: Position): Viking {
    return this.vikings.find(viking => viking.position.x === pPosition.x && viking.position.y === pPosition.y);
  }

  public vikingByRelativePosition(sourceViking: Viking): Viking {
    const targetPosition = sourceViking.position.withRelative(sourceViking.action.position);
    return this.vikingByPosition(targetPosition);
  }

  public allVikings(): Viking[] {
    return [...this.vikings];
  }
}