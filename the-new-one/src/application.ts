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

    /**
     * Type:   GET
     * Path:   /vikings/
     * Params: None
     *
     * Gets all Vikings from the game, excluding their ids and orders
     */
    this.application.get('/api/vikings', (req, res) => this.bridge.allVikings(req, res));
    /**
     * Type:   GET
     * Path:   /vikings/:id
     * Params:
     *  id:    The generated ID of the the Viking to lookup
     *
     * Gets a specific Viking from the game, including all existant information
     */
    this.application.get('/api/vikings/:id', (req, res) => this.bridge.singleViking(req, res));
    /**
     * Type:   POST
     * Path:   /vikings/
     * Params: None
     * Body:
     *   {
     *     "name": "someName"
     *   }
     *
     * Creates a new Viking with a randomly generated ID and shows it with all existant information
     */
    this.application.post('/api/vikings', (req, res) => this.bridge.newViking(req, res));
    /**
     * Type:   PUT
     * Path:   /vikings/
     * Params: None
     * Body:
     *   {
     *     "id": "vikingId"
     *     "action": {
     *       "order": "MOVE" | "STOP" | "HEAL" | "ATTACK",
     *       "position": {
     *       x: 0 | 1,
     *       y: 0 | 1
     *       }
     *     }
     *   }
     *
     * Updates the action of the Viking with the supplied ID if possible
     */
    this.application.put('/api/vikings', (req, res) => this.bridge.updateAction(req, res));
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