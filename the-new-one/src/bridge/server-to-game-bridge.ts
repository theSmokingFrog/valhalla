import { Game } from '../models/game';
import { Viking } from '../models/viking';
import { GameConfig } from '../config/game-config';

export class ServerToGameBridge {
  private game: Game;

  constructor() {
    this.game = new Game();
  }

  public allVikings(request, response): void {
    // TODO: Filter information; id should not be exposed!
    response.send(this.game.vikings);
  }

  public singleViking(request, response): void {
    const lookupID = request.params.id;
    const result = this.game.vikingById(lookupID);

    if (result != null) {
      response.send(result);
    } else {
      response.status(GameConfig.BAD_REQUEST_CODE).json({error: `Viking with ID '${lookupID}' was not found!`});
    }
  }

  public newViking(request, response): void {
    const body = request.body;
    if (body != null && body.name != null) {
      const vikingToAdd = new Viking(body.name);
      let maxPositionRetries: number = 10;

      while (this.game.vikingByPosition(vikingToAdd.position) && maxPositionRetries--) {
        console.log('reset called');
        vikingToAdd.resetPosition();
      }

      this.game.vikings.push(vikingToAdd);
      response.send(vikingToAdd);
    } else {
      response.status(GameConfig.BAD_REQUEST_CODE).json({error: `Request body is incomplete! It should be {name:'someName'}!`});
    }
  }

  public startGame() {
    this.game.start();
  }
}