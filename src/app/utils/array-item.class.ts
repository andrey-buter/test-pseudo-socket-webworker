import Big from 'big.js';
import * as Joi from 'joi';
import { APP_CONFIG } from '../app.config';
import { hasFloatPrecision } from './number.utils';

export interface RawArrayItem {
  id: string;
  int: number;
  float: string;
  color: string;
  child: {
    id: string;
    color: string;
  };
}

const childSchema = Joi.object({
  id: Joi.string().required(),
  color: Joi.string().required()
});

const arrayItemSchema = Joi.object({
  id: Joi.string().required(),
  int: Joi.number().integer().required(),
  float: Joi.string().required(),
  color: Joi.string().required(),
  child: childSchema.required(),
});

export class ArrayItem {
  id: string;
  int: number;
  float: Big;
  color: string;
  child: {
    id: string;
    color: string;
  };

  constructor(rawItem: RawArrayItem) {
    const { error, value } = arrayItemSchema.validate(rawItem);

    if (error) {
      throw new Error(`Invalid input: ${error.message}`);
    }

    if (!hasFloatPrecision(value.float, APP_CONFIG.floatPrecision)) {
      throw new Error(`Invalid input: float precision is invalid`);
    }

    this.id = value.id;
    this.int = value.int;
    this.float = new Big(value.float);
    this.color = value.color;
    this.child = value.child;
  }
}
