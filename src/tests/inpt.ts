import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Inpt, Schema} from '../main';

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
      age: "20a",
      birthDate: '1993-01-04'
    });

    expect(JSON.stringify(transformed)).to.equal(JSON.stringify({
      name: 'Dragos',
      email: 'dragos@email.com',
      age: 20,
      birthDate: "1993-01-03T22:00:00.000Z"
    }));
  });
});
