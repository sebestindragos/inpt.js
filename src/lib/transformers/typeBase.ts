/**
 * Type transformer base class.
 */
export class TypeBase {

  /**
   * Class constructor.
   */
  constructor (protected _originalValue: any) {}

  /**
   * Apply transform.
   */
  transform () : any {
    return this._originalValue;
  }
}
