import * as Joi from 'joi';

export interface RawArrayItem {
  id: unknown;
  int: unknown;
  float: unknown;
  color: unknown;
  child: unknown;
}

const childSchema = Joi.object({
  id: Joi.string().required(),
  color: Joi.string().required()
});

const arrayItemSchema = Joi.object({
  id: Joi.string().required(),
  int: Joi.number().integer().required(),
  float: Joi.number().precision(2).required(),
  color: Joi.string().required(),
  child: childSchema.required(),
});

export class ArrayItem {
  id: string;
  int: number;
  float: number;
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

    this.id = value.id;
    this.int = value.int;
    this.float = value.float;
    this.color = value.color;
    this.child = value.child;
  }
}
