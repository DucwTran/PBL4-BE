export default class ValidateMiddleware {
  static validate(schema) {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, {
          abortEarly: false,
          allowUnknown: true,
        });
        next();
      } catch (error) {
        next(error); 
      }
    };
  }
}
