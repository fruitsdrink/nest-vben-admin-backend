import { ValidationError, ValidationPipe } from '@nestjs/common';

export class Validate extends ValidationPipe {
  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string,
  ): ValidationError[] {
    const errors = super.mapChildrenToValidationErrors(error, parentPath);
    if (errors) {
      errors.map((error) => {
        for (const key in error.constraints) {
          error.constraints[key] = JSON.stringify({
            field: error.property,
            message: error.constraints[key],
          });
        }
      });
    }

    return errors;
  }
}
