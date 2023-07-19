import { faker } from '@faker-js/faker';
import { ArrayItem } from '../array-item.class';

export class TestDataGenerator {
  static getRandomFloat(min: number, max: number, precision: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
  }

  static generateArrayItem() {
    let testData: ArrayItem = {
      id: faker.string.uuid(),
      int: faker.number.int(),
      float: TestDataGenerator.getRandomFloat(0, 10000, 18),
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
