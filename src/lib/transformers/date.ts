import {parse, isDate, isValid} from 'date-fns';
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
    if (isDate(this._originalValue))
      return this._originalValue;

    if (
      this._originalValue === undefined ||
      this._originalValue === null ||
      typeof this._originalValue === 'number' ||
      typeof this._originalValue === 'object'
    ) {
      return new Date();
    }

    if (typeof this._originalValue === 'string') {
      let date = parse(this._originalValue);
      if (!isValid(date))
        return new Date();

      return date;
    }

    return new Date();
  }
}
