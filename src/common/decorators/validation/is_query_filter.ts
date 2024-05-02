import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isString,
  isUUID,
} from 'class-validator';
import { QueryFilterType, QueryOperator } from 'src/common/query';

export function IsQueryFilter(
  validationOptions?: ValidationOptions & {
    type: QueryFilterType;
  },
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isQueryFilter',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          console.log(value);
          if (typeof value !== 'object') {
            return false;
          } else if (
            !Object.keys(QueryOperator).includes(Object.keys(value)[0])
          ) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          console.log(args);
          return `${args.property} must be a valid query filter`;
        },
      },
    });
  };
}
