import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isUUID,
  isNumber,
  isNumberString,
} from 'class-validator';
import { StringQueryOperator } from './is_string_query_param';

export function IsNumberQueryParam(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNumberQueryParam',
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
          const allowArrayOperations = [
            StringQueryOperator.in.toString(),
            StringQueryOperator.notIn.toString(),
          ];
          const operations = Object.values(StringQueryOperator).map((op) =>
            op.toString(),
          );
          for (const key in value) {
            if (allowArrayOperations.includes(key)) {
              if (
                value[key].split(',').some((v: string) => !isNumberString(v))
              ) {
                return false;
              }
            } else if (operations.includes(key)) {
              if (!isNumberString(value[key])) {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid number query filter`;
        },
      },
    });
  };
}
