import { TestDataGenerator } from './item-generator';

describe('TestDataGenerator', () => {
  it('should generate a random float between the given range', () => {
    const min = 0;
    const max = 10;
    const precision = 2;

    const randomFloat = TestDataGenerator.getRandomFloat(min, max, precision);

    expect(randomFloat).toBeGreaterThanOrEqual(min);
    expect(randomFloat).toBeLessThanOrEqual(max);
    expect(randomFloat.toFixed(precision)).toHaveLength(precision + 3);
  });

  it('should generate an array item with valid properties', () => {
    const item = TestDataGenerator.generateArrayItem();

    expect(item.id).toBeDefined();
    expect(typeof item.id).toBe('string');

    expect(item.int).toBeDefined();
    expect(Number.isInteger(item.int)).toBe(true);

    expect(item.float).toBeDefined();
    expect(typeof item.float).toBe('number');

    expect(item.color).toBeDefined();
    expect(typeof item.color).toBe('string');

    expect(item.child).toBeDefined();
    expect(typeof item.child).toBe('object');
    expect(item.child.id).toBeDefined();
    expect(typeof item.child.id).toBe('string');
    expect(item.child.color).toBeDefined();
    expect(typeof item.child.color).toBe('string');
  });

  it('should generate an array of the specified size', () => {
    const size = 5;

    const array = TestDataGenerator.generateArray(size);

    expect(array).toHaveLength(size);
    expect(Array.isArray(array)).toBe(true);

    array.forEach((item) => {
      expect(typeof item).toBe('object');
    });
  });

});
