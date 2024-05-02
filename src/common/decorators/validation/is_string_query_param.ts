import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { QueryOperator } from 'src/common/query';

export enum StringQueryOperator {
  equals = 'eq',
  in = 'in',
  notIn = 'notIn',
  lt = 'lt',
  lte = 'lte',
  gt = 'gt',
  gte = 'gte',
  contains = 'contains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
}
export function IsStringQueryParam(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringQueryParam',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(value);
          const isObject = typeof value === 'object';
          if (!isObject) {
            return false;
          }
          const operations = Object.values(StringQueryOperator).map((op) =>
            op.toString(),
          );
          for (const key in value) {
            if (!operations.includes(key)) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid query filter`;
        },
      },
    });
  };
}
