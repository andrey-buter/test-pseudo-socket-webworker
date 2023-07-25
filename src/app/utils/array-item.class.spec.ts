import Big from 'big.js';
import { APP_CONFIG } from '../app.config';
import { ArrayItem, RawArrayItem } from './array-item.class';
import { TestDataGenerator } from './item-generator';

describe('ArrayItem', () => {
  const testRawItem: RawArrayItem = Object.freeze({
    id: 'stringId',
    int: 1,
    float: TestDataGenerator.getRandomFloat(),
    color: 'stringColor',
    child: Object.freeze({
      id: 'stringChildId',
      color: 'stringChildColor',
    }),
  });

  it('should create an instance of ArrayItem with valid input', () => {
    const arrayItem = new ArrayItem(testRawItem);

    expect(arrayItem.id).toBe('stringId');
    expect(arrayItem.int).toBe(testRawItem.int);
    expect(arrayItem.float).toBeInstanceOf(Big);
    expect(arrayItem.color).toBe('stringColor');
    expect(arrayItem.child.id).toBe('stringChildId');
    expect(arrayItem.child.color).toBe('stringChildColor');
  });

  it('should parse a float with 18 decimal places', () => {
    const strFloatWith18Decimals = TestDataGenerator.getRandomFloat();
    const arrayItem = new ArrayItem({
      ...testRawItem,
      float: strFloatWith18Decimals,
    });

    expect(arrayItem.float).toBeInstanceOf(Big);
    expect(arrayItem.float.toFixed(APP_CONFIG.floatPrecision)).toBe(strFloatWith18Decimals);
  });

  it('should throw an error for invalid input', () => {
    const invalidRawItem = {
      ...testRawItem,
      int: 'not a number',
    } as unknown as RawArrayItem;

    expect(() => new ArrayItem(invalidRawItem)).toThrowError('Invalid input: "int" must be a number');
  });

  it('should throw an error for a float with invalid precision', () => {
    const strFloatWithMoreDecimals = TestDataGenerator.getRandomFloat(APP_CONFIG.floatPrecision + 1);
    expect(
      () =>
        new ArrayItem({
          ...testRawItem,
          float: strFloatWithMoreDecimals,
        }),
    ).toThrowError('Invalid input: float precision is invalid');
  });
});
