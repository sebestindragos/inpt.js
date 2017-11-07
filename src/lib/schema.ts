import {TypeBase} from './transformers/typeBase';
import {String} from './transformers/string';
import {Number} from './transformers/number';
import {Datee} from './transformers/date';

type TypeTransformer = {new (value: any) : TypeBase};

interface SchemaInput {
  [key: string]: TypeTransformer | Array<TypeTransformer> | SchemaInput
}

/**
 * Schema class.
 *
 * @author Dragos Sebestin
 */
export class Schema {
  static Types = {
    String, Number, Date: Datee
  };

  /**
   * Class constructor.
   */
  constructor (private _schema: SchemaInput) { }

  /**
   * Apply defined schema to a given input.
   */
  apply (input: any) : Object {
    return this.applyTransform(input, this._schema);
  }

  /**
   * Apply a schema transform to a given input.
   */
  private applyTransform (input: any, schema: SchemaInput) {
    if (!input || (typeof input !== 'object'))
      return {};

    let projectedInput: any = {};
    for (const key in schema) {
      let transformerType = schema[key];
      if (typeof transformerType === 'function') {
        let TransformerClass: TypeTransformer = transformerType;
        let transformer = new TransformerClass(input[key]);
        projectedInput[key] = transformer.transform();
      } else if (Array.isArray(transformerType)) {
        let arrayInput = input[key];
        projectedInput[key] = transformerType.map((TransformerClass, index) => {
          let transformer = new TransformerClass(arrayInput[index]);
          return transformer.transform();
        });
      } else if (typeof transformerType === 'object') {
        let childSchema: SchemaInput = transformerType;
        projectedInput[key] = this.applyTransform(input[key], childSchema);
      }
    }

    return projectedInput;
  }
}
