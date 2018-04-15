import {SchemaInput, TypeTransformer} from '../schema';

/**
 * Optional type transformer.
 * Can be used to transform values
 * with another type transformer only if we have input data.
 *
 * @author Dragos Sebestin
 */
export class OptionalTransformer {

  /**
   * Class constructor.
   */
  constructor (
    public schema: TypeTransformer | Array<TypeTransformer> | SchemaInput | Array<SchemaInput>
  ) {}
}
