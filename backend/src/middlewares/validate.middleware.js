export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      // Zod v4 exposes issues on `.issues` (the `.errors` alias from v3 is gone).
      const issues = error.issues ?? error.errors;
      const formattedErrors = Array.isArray(issues)
        ? issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        : [{ message: error.message }];

      res.status(400).json({
        error: formattedErrors.map((e) => (e.field ? `${e.field}: ${e.message}` : e.message)).join('; '),
        details: formattedErrors
      });
    }
  };
};
