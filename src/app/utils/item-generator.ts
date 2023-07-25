import { faker } from '@faker-js/faker';
import Big from 'big.js';
import { APP_CONFIG } from '../app.config';
import { RawArrayItem } from './array-item.class';

export class TestDataGenerator {
  static getRandomFloat(precision = APP_CONFIG.floatPrecision): string {
    const randomNumber = new Big(Math.random());
    return randomNumber.toFixed(precision);
  }

  static generateArrayItem() {
    let testData: RawArrayItem = {
      id: faker.string.uuid(),
      int: faker.number.int(),
      float: TestDataGenerator.getRandomFloat(),
      color: faker.internet.color(),
      child: {
        id: faker.string.uuid(),
        color: faker.internet.color(),
      },
    };
    return testData;
  }

  static generateArray(size: number) {
    return  Array.from({ length: size }, (_, index) => TestDataGenerator.generateArrayItem())
  }
}
