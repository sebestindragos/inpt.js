import {Schema} from './schema';

/**
 * Input transformer class.
 * Runs transform on a JSON object based on a schema.
 *
 * @author Dragos Sebestin
 */
export class Inpt {

  /**
   * Class constructor.
   */
  constructor (private _schema: Schema) {}

  /**
   * Transform a given input.
   */
  transform (input: any) : any {
    return this._schema.apply(input);
  }
}
