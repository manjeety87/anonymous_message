/* eslint-disable @typescript-eslint/ban-ts-comment */
export const statusInfo = [
  {
    code: 200,
    message: "OK",
  },
  {
    code: 201,
    message: "Created",
  },
  {
    code: 400,
    message: "Bad Request",
  },
  {
    code: 401,
    message: "Unauthorized",
  },
  {
    code: 403,
    message: "Forbidden",
  },
  {
    code: 404,
    message: "Not Found",
  },
  {
    code: 409,
    message: "Conflict",
  },
  {
    code: 422,
    message: "Validation Fault",
  },
  {
    code: 429,
    message: "Too Many Requests",
  },
  {
    code: 500,
    message: "Internal Server Error",
  },
  {
    code: 503,
    message: "Service Unavailable",
  },
];

export function successResponse(message: any, data?: any) {
  const response = {
    code: 200,
    error: false,
    message: message,
    ...data,
  };
  return response;
}

export function errorResponse(statusCode: any, message: any, data?: any) {
  // Get matched code
  const findCode = statusInfo.find((t) => t.code == statusCode);
  let code;
  if (!findCode)
    code = {
      code: 500,
      message: "Internal Server Error",
    };
  else code = findCode;
  return {
    code: code.code,
    error: true,
    message: message || code.message,
    data,
  };
}

export function newCustomError(message: string, code: number | string) {
  const error = new Error(message);
  //@ts-ignore
  error.code = code;
  return error;
}

exports.statusCodeInfo = statusInfo;

// module.exports = {
//   UnAuthorizedAccess: "User is not authorized to access this resource",
//   DatabaseConnectionError: "Error connecting to database",
//   successResponse,
//   errorResponse,
//   newCustomError,
//   statusCodeInfo: statusInfo,
// };