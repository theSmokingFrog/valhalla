import { Viking } from './viking';
import { GameConfig } from '../config/game-config';
import { Position } from './position';
import { Action } from './action';

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
    // 1. Execute Order 'Attack'
    // 2. get rid of the dead Vikings
    // 3. Level up the remaining vikings
    // 4. Execute Order 'Move'
    // 5. Execute Order 'Heal'
    // 6. Reset all Orders to 'Stop'
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
      vikingToAdd.resetPosition();
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

  public allVikings(): Viking[] {
    return [...this.vikings];
  }
}