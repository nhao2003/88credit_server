import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isPositive,
} from 'class-validator';

export function IsPositiveNumberString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveNumberString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const number = Number(value);
          return isPositive(number);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a positive number string.`;
        },
      },
    });
  };
}
