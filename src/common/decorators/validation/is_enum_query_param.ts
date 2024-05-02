import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { StringQueryOperator } from './is_string_query_param';

export enum EnumQueryOperator {
  equals = 'eq',
  in = 'in',
  notIn = 'notIn',
}

export function IsEnumQueryParam(
  validationOptions?: ValidationOptions & { enum: any },
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEnumQueryParam',
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
            EnumQueryOperator.in.toString(),
            EnumQueryOperator.notIn.toString(),
          ];
          for (const key in value) {
            if (allowArrayOperations.includes(key)) {
              if (
                value[key]
                  .split(',')
                  .some(
                    (v: string) =>
                      !Object.values(validationOptions.enum).includes(v),
                  )
              ) {
                return false;
              }
            } else if (EnumQueryOperator.equals.toString() === key) {
              if (!Object.values(validationOptions.enum).includes(value[key])) {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Enum query filter`;
        },
      },
    });
  };
}
