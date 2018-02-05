import {TypeBase} from './transformers/typeBase';
import {String} from './transformers/string';
import {Number} from './transformers/number';
import {Datee} from './transformers/date';

export type TypeTransformer = {new (value: any) : TypeBase};

export interface SchemaInput {
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
  private applyTransform (input: any, schema: SchemaInput) : Object {
    if (!input || (typeof input !== 'object'))
      input = {};

    let projectedInput: any = {};
    for (const key in schema) {
      let transformerType = schema[key];
      if (typeof transformerType === 'function') {
        let TransformerClass: TypeTransformer = transformerType;
        let transformer = new TransformerClass(input[key]);
        projectedInput[key] = transformer.transform();
      } else if (Array.isArray(transformerType)) {
        let TransformerClass: TypeTransformer = transformerType[0];
        let arrayInput = input[key];
        projectedInput[key] = [];
        if (Array.isArray(arrayInput)) {
          arrayInput.forEach(item => {
            let transformer = new TransformerClass(item);
            projectedInput[key].push(transformer.transform());
          });
        }
      } else if (typeof transformerType === 'object') {
        let childSchema: SchemaInput = transformerType;
        projectedInput[key] = this.applyTransform(input[key], childSchema);
      }
    }

    return projectedInput;
  }
}
