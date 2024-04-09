import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsValidPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // const passwordRegex =
          //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{:;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/;
          // At least one character
          const passwordRegex = /^(?=.*[a-zA-Z])/;
          return typeof value === 'string' && value.length >= 1;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid password.`;
        },
      },
    });
  };
}
