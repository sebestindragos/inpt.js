import 'mocha';
import {expect} from 'chai';

import {StringTransformer} from '../lib/transformers/string';
import {NumberTransformer} from '../lib/transformers/number';
import {DateTransformer} from '../lib/transformers/date';
import {BooleanTransformer} from '../lib/transformers/boolean';

describe('Transformers', () => {
  describe('String', () => {
    it ('should transform undefined to empty string', () => {
      let transformer = new StringTransformer(undefined);
      expect(transformer.transform()).to.equal('');
    });

    it ('should transform null to empty string', () => {
      let transformer = new StringTransformer(null);
      expect(transformer.transform()).to.equal('');
    });

    it ('should transform a number to it\'s string representation', () => {
      let transformer = new StringTransformer(10);
      expect(transformer.transform()).to.equal('10');

      transformer = new StringTransformer(0);
      expect(transformer.transform()).to.equal('0');

      transformer = new StringTransformer(19.87);
      expect(transformer.transform()).to.equal('19.87');

      transformer = new StringTransformer(NaN);
      expect(transformer.transform()).to.equal('NaN');
    });

    it ('should stringify an object', () => {
      let transformer = new StringTransformer({a: '1', b: 2});
      expect(transformer.transform()).to.equal('{"a":"1","b":2}');

      transformer = new StringTransformer([1, 2, 3, '4']);
      expect(transformer.transform()).to.equal('[1,2,3,"4"]');
    });
  });

  describe('Number', () => {
    it('should transform undefined to NaN', () => {
      let transformer = new NumberTransformer(undefined);
      expect(transformer.transform()).to.be.NaN;
    });

    it('should transform null to NaN', () => {
      let transformer = new NumberTransformer(null);
      expect(transformer.transform()).to.be.NaN;
    });

    it('should be noop for a number', () => {
      let transformer = new NumberTransformer(0);
      expect(transformer.transform()).to.equal(0);
      transformer = new NumberTransformer(1);
      expect(transformer.transform()).to.equal(1);
      transformer = new NumberTransformer(178.901);
      expect(transformer.transform()).to.equal(178.901);
      transformer = new NumberTransformer(-23);
      expect(transformer.transform()).to.equal(-23);
      transformer = new NumberTransformer(-23.56);
      expect(transformer.transform()).to.equal(-23.56);
    });

    it('should parser a string to a number', () => {
      let transformer = new NumberTransformer('123');
      expect(transformer.transform()).to.equal(123);
      transformer = new NumberTransformer('a');
      expect(transformer.transform()).to.be.NaN;
      transformer = new NumberTransformer('1234asd');
      expect(transformer.transform()).to.be.NaN;
    });
  });

  describe('Datee', () => {
    it ('should transform a non-date input to a default date object', () => {
      let transformer = new DateTransformer('');
      let now = new Date();
      let transformedDate = transformer.transform();
      expect(transformedDate.getMinutes()).to.be.equal(now.getMinutes());
    });
    it ('should parse a string to a valid date object', () => {
      let date = new Date(2017, 10, 7);
      let transformer = new DateTransformer('2017-11-07');
      expect(transformer.transform().getTime()).to.equal(date.getTime());
    });
  });

  describe('Boolean', () => {
    it ('should transform non boolean value to it\'s truthy representation', () => {
      let transformer = new BooleanTransformer(1);
      expect(transformer.transform()).to.equal(true);

      transformer = new BooleanTransformer(0);
      expect(transformer.transform()).to.equal(false);

      transformer = new BooleanTransformer('asd');
      expect(transformer.transform()).to.equal(true);

      transformer = new BooleanTransformer('');
      expect(transformer.transform()).to.equal(false);

      transformer = new BooleanTransformer({});
      expect(transformer.transform()).to.equal(true);

      transformer = new BooleanTransformer('false');
      expect(transformer.transform()).to.equal(false);
    });

    it ('should transform a boolean value to it\'s original value', () => {
      let transformer = new BooleanTransformer(true);
      expect(transformer.transform()).to.equal(true);

      transformer = new BooleanTransformer(false);
      expect(transformer.transform()).to.equal(false);
    });
  });
});
