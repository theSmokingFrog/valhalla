import { Viking } from './viking';
import { GameConfig } from '../config/game-config';
import { Position } from './position';

export class Game {
  private gameStarted: boolean = false;
  private gameRoundRunning: boolean = false;
  private gameRound: number = 1;
  vikings: Viking[] = [];

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

  public vikingById(id: string) {
    return this.vikings.find(viking => viking.id === id);
  }

  public vikingByPosition(pPosition: Position) {
    return this.vikings.find(viking => viking.position.x === pPosition.x && viking.position.y === pPosition.y);
  }
}