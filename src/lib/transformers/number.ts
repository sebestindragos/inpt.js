import {TypeBase} from './typeBase';

/**
 * Number type transformer.
 *
 * @author Dragos Sebestin
 */
export class Number extends TypeBase {

  /**
   * Transform input.
   */
  transform () : number {
    // check for valid Number and otherwise return NaN
    if (typeof this._originalValue === 'number')
      return this._originalValue;

    if (typeof this._originalValue === 'string')
      return parseInt(this._originalValue);

    return NaN;
  }
}
