import { Order } from './order';
import { Position } from './position';

export class Action {
  order: Order;
  position?: Position;

  constructor() {
  }

  public static stop(): Action {
    const action = new Action();
    action.order = Order.STOP;
    return action;
  }

  public static validate(action: Action): boolean {
    let isValid: boolean;
    switch (action.order) {
      case Order.ATTACK:
      case Order.MOVE:
        isValid = Position.validateMoveOrAttackPosition(action.position);
        break;
      case Order.HEAL:
      case Order.STOP:
        // If heal or stop, a position is not necessary
        isValid = true;
        break;
      default:
        // If the actions are not of the above its wrong
        isValid = false;
        break;
    }
    return isValid;
  }
}