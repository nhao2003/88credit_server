import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isUUID,
} from 'class-validator';
import { StringQueryOperator } from './is_string_query_param';

export function IsUUIDQueryParam(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUUIDQueryParam',
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
              if (value[key].split(',').some((v: string) => !isUUID(v)))
                return false;
            } else if (operations.includes(key)) {
              if (!isUUID(value[key])) {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid UUID query filter`;
        },
      },
    });
  };
}
