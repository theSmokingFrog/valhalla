import express from 'express';
import * as bodyParser from 'body-parser';
import { ServerToGameBridge } from './bridge/server-to-game-bridge';

export class Application {
  private application: express.Application = express();
  private bridge: ServerToGameBridge;

  constructor() {
    this.bridge = new ServerToGameBridge();

    this.application.set('port', 8080);
    this.application.use(bodyParser.json());

    this.application.get('/', (req, res) => res.send(`yeah... I'm alive?`));

    // GET  |  /vikings      |  Gets all Vikings without Orders and IDs
    this.application.get('/api/vikings', (req, res) => this.bridge.allVikings(req, res));
    // GET  |  /vikings/:id  |  Gets a specific Viking with all information
    this.application.get('/api/vikings/:id', (req, res) => this.bridge.singleViking(req, res));
    // POST |  /vikings      |  Adds a new Viking to the game
    this.application.post('/api/vikings', (req, res) => this.bridge.newViking(req, res));
    // PUT  |  /vikings      |  Sets the action for a viking
  }

  public run() {
    this.application.listen(this.application.get('port'), () => {
      console.log(this.startupText());
      this.bridge.startGame();
    });
  }

  private startupText(): string {
    return `--- VALHALLA ---
>> App is running at http://localhost:${this.application.get('port')} in ${this.application.get('env')} mode
>> Press CTRL-C to stop
----------------\n`;
  }
}