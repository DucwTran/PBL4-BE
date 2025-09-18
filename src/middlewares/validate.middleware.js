export default class ValidateMiddleware {
  static validate(schema) {
    return (req, res, next) => {
      schema
        .validateAsync(req.body, {
          abortEarly: false,
          allowUnknown: true,
        })
        .then(() => {
          next();
        })
        .catch(next);
    };
  }
}
