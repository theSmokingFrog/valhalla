import { Action, Game } from '../models';
import { GameConfig } from '../config';

export class ServerToGameBridge {
  private game: Game;

  constructor() {
    this.game = new Game();
  }

  private static isUpdateActionBodyValid(requestBody): boolean {
    let isValid: boolean = false;
    // Is everything necessary present?
    if (requestBody != null && requestBody.id != null && requestBody.action != null) {
      // Check if a valid action is supplied
      if (Action.validate(requestBody.action)) {
        isValid = true;
      }
    }
    return isValid;
  }

  public allVikings(request, response): void {
    const copiedVikings = [...this.game.allVikings()];
    copiedVikings.forEach(viking => delete viking.id);
    response.send(copiedVikings);
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
      const createdViking = this.game.createNewViking(body.name);
      response.send(createdViking);
    } else {
      response.status(GameConfig.BAD_REQUEST_CODE).json({error: `Request body is incomplete! It should be {name:'someName'}!`});
    }
  }

  public updateAction(request, response): void {
    const body = request.body;
    if (ServerToGameBridge.isUpdateActionBodyValid(body)) {
      const updatedViking = this.game.setActionForViking(body.id, body.action);
      if (updatedViking) {
        response.send(updatedViking);
      } else {
        response.status(GameConfig.BAD_REQUEST_CODE).json({error: `Viking with ID '${body.id}' was not found!`});
      }
    } else {
      response.status(GameConfig.BAD_REQUEST_CODE).json({error: `Request body is incomplete or wrong! Take a look at the docs!`});
    }
  }

  public startGame() {
    this.game.start();
  }
}