/**
 * Validation options for text input.
 */
interface InputValidate {
    /** Value to validate. */
    value: string;

    /** Main entity name used in error messages (e.g. Project, User, Secret). */
    mainTitle?: string;

    /** Field name used in error messages (e.g. Name, Email). */
    title?: string;

    /** Minimum allowed character length. */
    minSize?: number;

    /** Maximum allowed character length. */
    maxSize?: number;
}

/**
 * Result returned by {@link validate}.
 */
type ValidationResult =
    | {
          /** Sanitized value after validation. */
          value: string;

          /** Indicates validation succeeded. */
          success: true;
      }
    | {
          /** Validation error message. */
          message: string;

          /** Indicates validation failed. */
          success: false;
      };

/**
 * Validates a text input and returns a typed result.
 *
 * Validation rules:
 * - Value is required
 * - Value must meet the minimum length
 * - Value must not exceed the maximum length
 *
 * Leading and trailing whitespace is removed before validation.
 *
 * @param params - Validation configuration.
 * @param params.value - Raw input value.
 * @param params.mainTitle - Entity name used in error messages. Defaults to `"Project"`.
 * @param params.title - Field name used in error messages. Defaults to `"Name"`.
 * @param params.minSize - Minimum allowed length. Defaults to `5`.
 * @param params.maxSize - Maximum allowed length. Defaults to `100`.
 *
 * @returns A validation result object.
 *
 * @example
 * const result = validate({
 *   value: "My Project"
 * });
 *
 * if (result.success) {
 *   console.log(result.value);
 * }
 *
 * @example
 * const result = validate({
 *   value: ""
 * });
 *
 * if (!result.success) {
 *   console.log(result.message);
 * }
 *
 * @example
 * const result = validate({
 *   value: "Hi",
 *   title: "Project Name",
 *   minSize: 5
 * });
 *
 * // {
 * //   success: false,
 * //   message: "Project Name must be at least 5 characters."
 * // }
 */
export const validate = ({
    value,
    minSize = 5,
    maxSize = 100,
    title = "Name",
    mainTitle = "Project",
}: InputValidate): ValidationResult => {
    const trimmed = value.trim();

    if (!trimmed) {
        return {
            success: false,
            message: `${mainTitle} ${title} is required.`,
        };
    }

    if (trimmed.length < minSize) {
        return {
            success: false,
            message: `${title} must be at least ${minSize} characters.`,
        };
    }

    if (trimmed.length > maxSize) {
        return {
            success: false,
            message: `${title} must be ${maxSize} characters or fewer.`,
        };
    }

    return {
        success: true,
        value: trimmed,
    };
};
