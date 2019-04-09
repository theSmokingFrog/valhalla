export class Action {
  order: string;
  position?: Position;

  constructor() {
  }

  public static stop(): Action {
    const action = new Action();
    action.order = 'Stop';
    return action;
  }
}