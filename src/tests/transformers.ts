import 'mocha';
import {expect} from 'chai';

import {String} from '../lib/transformers/string';
import {Number} from '../lib/transformers/number';
import {Datee} from '../lib/transformers/date';
import {Boolean} from '../lib/transformers/boolean';

describe('Transformers', () => {
  describe('String', () => {
    it ('should transform undefined to empty string', () => {
      let transformer = new String(undefined);
      expect(transformer.transform()).to.equal('');
    });

    it ('should transform null to empty string', () => {
      let transformer = new String(null);
      expect(transformer.transform()).to.equal('');
    });

    it ('should transform a number to it\'s string representation', () => {
      let transformer = new String(10);
      expect(transformer.transform()).to.equal('10');

      transformer = new String(0);
      expect(transformer.transform()).to.equal('0');

      transformer = new String(19.87);
      expect(transformer.transform()).to.equal('19.87');

      transformer = new String(NaN);
      expect(transformer.transform()).to.equal('NaN');
    });

    it ('should stringify an object', () => {
      let transformer = new String({a: '1', b: 2});
      expect(transformer.transform()).to.equal('{"a":"1","b":2}');

      transformer = new String([1, 2, 3, '4']);
      expect(transformer.transform()).to.equal('[1,2,3,"4"]');
    });
  });

  describe('Number', () => {
    it('should transform undefined to NaN', () => {
      let transformer = new Number(undefined);
      expect(transformer.transform()).to.be.NaN;
    });

    it('should transform null to NaN', () => {
      let transformer = new Number(null);
      expect(transformer.transform()).to.be.NaN;
    });

    it('should be noop for a number', () => {
      let transformer = new Number(0);
      expect(transformer.transform()).to.equal(0);
      transformer = new Number(1);
      expect(transformer.transform()).to.equal(1);
      transformer = new Number(178.901);
      expect(transformer.transform()).to.equal(178.901);
      transformer = new Number(-23);
      expect(transformer.transform()).to.equal(-23);
      transformer = new Number(-23.56);
      expect(transformer.transform()).to.equal(-23.56);
    });

    it('should parser a string to a number', () => {
      let transformer = new Number('123');
      expect(transformer.transform()).to.equal(123);
      transformer = new Number('a');
      expect(transformer.transform()).to.be.NaN;
      transformer = new Number('1234asd');
      expect(transformer.transform()).to.equal(1234);
    });
  });

  describe('Datee', () => {
    it ('should transform a non-date input to a default date object', () => {

    });
    it ('should parse a string to a valid date object', () => {
      let date = new Date(2017, 10, 7);
      let transformer = new Datee('2017-11-7');
      expect(transformer.transform().getTime()).to.equal(date.getTime());
    });
  });

  describe('Boolean', () => {
    it ('should transform non boolean value to it\'s truthy representation', () => {
      let transformer = new Boolean(1);
      expect(transformer.transform()).to.equal(true);

      transformer = new Boolean(0);
      expect(transformer.transform()).to.equal(false);

      transformer = new Boolean('asd');
      expect(transformer.transform()).to.equal(true);

      transformer = new Boolean('');
      expect(transformer.transform()).to.equal(false);

      transformer = new Boolean({});
      expect(transformer.transform()).to.equal(true);
    });

    it ('should transform a boolean value to it\'s original value', () => {
      let transformer = new Boolean(true);
      expect(transformer.transform()).to.equal(true);

      transformer = new Boolean(false);
      expect(transformer.transform()).to.equal(false);
    });
  });
});
