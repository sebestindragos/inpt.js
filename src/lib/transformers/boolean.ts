import {TypeBase} from './typeBase';

/**
 * Boolean type transformer.
 *
 * @author Dragos Sebestin
 */
export class BooleanTransformer extends TypeBase {

  /**
   * Transform input.
   */
  transform () : boolean {
    if (typeof this._originalValue === 'string')
      if (this._originalValue === 'false')
        return false;

    return !!this._originalValue;
  }
}
