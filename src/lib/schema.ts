import {TypeBase} from './transformers/typeBase';
import {StringTransformer} from './transformers/string';
import {NumberTransformer} from './transformers/number';
import {DateTransformer} from './transformers/date';
import {BooleanTransformer} from './transformers/boolean';
import {OptionalTransformer} from './transformers/optional';

export type TypeTransformer = {new (value: any) : TypeBase};

export interface SchemaInput {
  [key: string]: TypeTransformer | OptionalTransformer | Array<TypeTransformer> | SchemaInput | Array<SchemaInput>
}

/**
 * Schema class.
 *
 * @author Dragos Sebestin
 */
export class Schema {
  static Types = {
    String: StringTransformer,
    Number: NumberTransformer,
    Date: DateTransformer,
    Boolean: BooleanTransformer,
    Optional: function (schema: TypeTransformer | Array<TypeTransformer> | SchemaInput | Array<SchemaInput>) {
      return new OptionalTransformer(schema);
    }
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
      if (transformerType instanceof OptionalTransformer) {
        if (input[key] !== undefined) {
          let optional: OptionalTransformer = transformerType;
          let result = this.applyTransform(input, {[key]: optional.schema});
          projectedInput[key] = result[key];
        }
      } else if (typeof transformerType === 'function') {
        let TransformerClass: TypeTransformer = transformerType;
        let transformer = new TransformerClass(input[key]);
        projectedInput[key] = transformer.transform();
      } else if (Array.isArray(transformerType) && typeof transformerType[0] === 'function') {
        let TransformerClass: TypeTransformer = transformerType[0] as TypeTransformer;
        let arrayInput = input[key];
        projectedInput[key] = [];
        if (Array.isArray(arrayInput)) {
          arrayInput.forEach(item => {
            let transformer = new TransformerClass(item);
            projectedInput[key].push(transformer.transform());
          });
        }
      } else if (Array.isArray(transformerType) && typeof transformerType[0] === 'object') {
        let childSchema: SchemaInput = transformerType[0] as SchemaInput;
        let arrayInput = input[key];
        projectedInput[key] = [];
        if (Array.isArray(arrayInput)) {
          arrayInput.forEach(item => {
            projectedInput[key].push(
              this.applyTransform(item, childSchema)
            );
          });
        }
      } else if (typeof transformerType === 'object') {
        let childSchema: SchemaInput = transformerType as SchemaInput;
        projectedInput[key] = this.applyTransform(input[key], childSchema);
      }
    }

    return projectedInput;
  }
}
