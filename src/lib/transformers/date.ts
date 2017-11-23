import {parse, isDate} from 'date-fns';
import {TypeBase} from './typeBase';

/**
 * Date type transformer.
 *
 * @author Dragos Sebestin
 */
export class Datee extends TypeBase {

  /**
   * Transform input.
   */
  transform () : Date {
    // check for valid Date and otherwise return current date
    if (isDate(this._originalValue))
      return this._originalValue;
      
    if (typeof this._originalValue === 'string')
      return parse(this._originalValue);

    return new Date();
  }
}
