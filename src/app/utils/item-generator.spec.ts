import { APP_CONFIG } from '../app.config';
import { TestDataGenerator } from './item-generator';
import { hasFloatPrecision } from './number.utils';

describe('TestDataGenerator', () => {
  describe('getRandomFloat', () => {
    it('should return a random float with the default precision', () => {
      const randomFloat = TestDataGenerator.getRandomFloat();

      expect(hasFloatPrecision(randomFloat, APP_CONFIG.floatPrecision)).toBe(true);
    });

    it('should return a random float with the specified precision', () => {
      const precision = 19;
      const randomFloat = TestDataGenerator.getRandomFloat(precision);

      expect(hasFloatPrecision(randomFloat, precision)).toBe(true);
    });
  });

  describe('generateArrayItem', () => {
    it('should generate a valid array item', () => {
      const arrayItem = TestDataGenerator.generateArrayItem();

      expect(arrayItem).toHaveProperty('id');
      expect(arrayItem).toHaveProperty('int');
      expect(arrayItem).toHaveProperty('float');
      expect(arrayItem).toHaveProperty('color');
      expect(arrayItem).toHaveProperty('child');
      expect(arrayItem.child).toHaveProperty('id');
      expect(arrayItem.child).toHaveProperty('color');
    });

    it('should generate an array of the specified size', () => {
      const size = 5;
      const array = TestDataGenerator.generateArray(size);

      expect(array).toHaveLength(size);
      expect(Array.isArray(array)).toBe(true);

      array.forEach(item => {
        expect(typeof item).toBe('object');
      });
    });
  });
});
