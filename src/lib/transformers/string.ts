import {TypeBase} from './typeBase';

/**
 * String type transformer.
 *
 * @author Dragos Sebestin
 */
export class String extends TypeBase {

  /**
   * Transform input.
   */
  transform () : string {
    if (this._originalValue === undefined || this._originalValue === null)
      return '';

    if (typeof this._originalValue === 'number')
      return this._originalValue.toString();

    if (typeof this._originalValue === 'object')
      return JSON.stringify(this._originalValue);

    if (typeof this._originalValue === 'string')
      return this._originalValue;

    return '';
  }
}
