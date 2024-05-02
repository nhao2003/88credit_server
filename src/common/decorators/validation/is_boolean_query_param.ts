import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export enum BoolenQueryOperator {
  equals = 'eq',
}

export function IsBooleanQueryParam(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBooleanQueryParam',
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

          for (const key in value) {
            if (BoolenQueryOperator.equals.toString() === key) {
              if (value[key] !== 'true' && value[key] !== 'false') {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Boolean query filter`;
        },
      },
    });
  };
}
