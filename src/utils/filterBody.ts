/**
 * Filters and validates the request body based on the allowed keys and validation function.
 * @param reqBody - The request body to filter and validate.
 * @param allowedKeys - The allowed keys in the request body.
 * @param validationFn - The validation function to apply to each value in the request body.
 * @returns The filtered and validated request body.
 */
function filterBody(reqBody: Record<string, any>, allowedKeys: string[]): Record<string, any> {
  const filteredRequestBody: Record<string, any> = {};
  for (const key of allowedKeys) {
    if (reqBody.hasOwnProperty(key) && reqBody[key] !== undefined && reqBody[key] !== null) {
      filteredRequestBody[key] = reqBody[key];
    }
  }

  return filteredRequestBody;
}
export default filterBody;
