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
    // check for valid Date and otherwise try to convert it or return empty string
    if (typeof this._originalValue === 'number')
      return this._originalValue.toString();

    if (typeof this._originalValue === 'object' && this._originalValue !== null)
      return JSON.stringify(this._originalValue);

    if (typeof this._originalValue === 'string')
      return this._originalValue;

    return '';
  }
}
