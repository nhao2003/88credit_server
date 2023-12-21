import { checkSchema } from 'express-validator';
import { Service } from 'typedi';
import { validate } from '../utils/validation';

@Service()
class BlogValidation {
  public checkCreateBlog = validate(
    checkSchema({
      title: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Title is required',
        },
        trim: true,
        isString: {
          errorMessage: 'Title is not valid',
        },
        isLength: {
          errorMessage: 'Title must be at least 1 characters and less than 255 characters',
          options: { min: 1, max: 255 },
        },
      },
      content: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Content is required',
        },
        trim: true,
        isString: {
          errorMessage: 'Content is not valid',
        },
      },
      images: {
        in: ['body'],
        optional: true,
        isArray: {
          errorMessage: 'Images must be an array',
        },
        custom: {
          options: (value: any) => {
            if (!value) return true;
            return value.every((item: any) => validate(item));
          },
          errorMessage: 'Images must be an array of uuid',
        },
      },
      author: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Author is required',
        },
        trim: true,
        isString: {
          errorMessage: 'Author is not valid',
        },
        isLength: {
          errorMessage: 'Author must be at least 1 characters and less than 255 characters',
          options: { min: 1, max: 255 },
        },
      },
      short_description: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Short description is required',
        },
        trim: true,
        isString: {
          errorMessage: 'Short description is not valid',
        },
        isLength: {
          errorMessage: 'Short description must be at least 1 characters and less than 255 characters',
          options: { min: 1, max: 255 },
        },
      },
    }),
  );
}

export default BlogValidation;
