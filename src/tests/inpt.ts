import 'mocha';
import {expect} from 'chai';

import {Inpt, Schema} from '../main';
import {TypeBase} from '../lib/transformers/typeBase';

describe('Inpt class', () => {
  it ('should apply a given schema to an input.', () => {
    let inpt = new Inpt(new Schema({
      name: Schema.Types.String,
      email: Schema.Types.String,
      age: Schema.Types.Number,
      birthDate: Schema.Types.Date
    }));

    let transformed = inpt.transform({
      name: 'Dragos',
      email: 'dragos@email.com',
      age: "20",
      birthDate: '1993-01-04T00:00:00.000Z'
    });

    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({
      name: 'Dragos',
      email: 'dragos@email.com',
      age: 20,
      birthDate: "1993-01-04T00:00:00.000Z"
    }));
  });

  it ('should transform an array to given input type', () => {
    let inpt = new Inpt(new Schema({
      names: [Schema.Types.String]
    }));

    let transformed = inpt.transform({
      names: [
        'one', 2, 'three',
        new Date("2018-02-05T10:12:20.066Z"),
        {someKey: 2}
      ]
    });

    expect(transformed.names.length).to.eq(5);
    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({
      names: [
        'one', '2', 'three',
        '"2018-02-05T10:12:20.066Z"',
        '{"someKey":2}'
      ]
    }));
  });

  it ('should apply a subschema', () => {
    let inpt = new Inpt(new Schema({
      profile: {
        name: Schema.Types.String,
        age: Schema.Types.Number,
        birthDate: Schema.Types.Date
      }
    }));

    let transformed = inpt.transform({
      shouldNotBe: 'Am not supposed to be in the transformed payload.',
    });

    expect(transformed.profile.name).to.eq('');

    transformed = inpt.transform({
      profile: {
        name: {
          $set: null
        }
      },
    });

    expect(transformed.profile.name).to.eq('{"$set":null}');
    expect(transformed.profile.age).to.be.NaN;
  });

  it ('should apply a custom transformer', () => {
    class Custom extends TypeBase {
      transform () {
        return [this._originalValue];
      }
    }

    let inpt = new Inpt(new Schema({
      data: Custom
    }));

    let transformed = inpt.transform({
      data: 'custom payload',
    });

    expect(transformed.data.length).to.eq(1);
  });

  it ('should transform an array to given subschema', () => {
    let inpt = new Inpt(new Schema({
      people: [{
        name: Schema.Types.String,
        age: Schema.Types.Number,
        id: Schema.Types.Number,
      }]
    }));

    let transformed = inpt.transform({
      people: [{
        name: 'dragos',
        age: 25
      }]
    });

    expect(transformed.people.length).to.eq(1);
    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({
      people: [{
        name: 'dragos',
        age: 25,
        id: NaN
      }]
    }));
  });

  it ('should avoid transforms if a schema is optional and there is no provided value', () => {
    let inpt = new Inpt(new Schema({
      stringValue: Schema.Types.Optional(Schema.Types.String)
    }));

    let transformed = inpt.transform({});

    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({}));
  });

  it ('should apply optional transform', () => {
    let inpt = new Inpt(new Schema({
      stringValue: Schema.Types.Optional(Schema.Types.String),
      numberValue: Schema.Types.Optional(Schema.Types.Number),
      embedded: Schema.Types.Optional({
        from: Schema.Types.Number,
        to: Schema.Types.Number
      }),
    }));

    let transformed = inpt.transform({
      stringValue: 'asd',
      numberValue: 25
    });

    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({
      stringValue: 'asd',
      numberValue: 25
    }));

    transformed = inpt.transform({
      embedded: {}
    });

    expect(transformed.embedded.from).to.be.NaN;
    expect(transformed.embedded.to).to.be.NaN;

    transformed = inpt.transform({
      embedded: {
        from: 25,
        to: 28
      }
    });

    expect(transformed.stringValue).to.be.undefined;
    expect(transformed.numberValue).to.be.undefined;
    expect(transformed.embedded.from).to.be.eq(25);
    expect(transformed.embedded.to).to.be.eq(28);
  });
});
