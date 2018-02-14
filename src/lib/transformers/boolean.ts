import {TypeBase} from './typeBase';

/**
 * Boolean type transformer.
 *
 * @author Dragos Sebestin
 */
export class Boolean extends TypeBase {

  /**
   * Transform input.
   */
  transform () : boolean {
    return !!this._originalValue;
  }
}
