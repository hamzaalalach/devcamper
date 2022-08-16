"use strict";
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = ErrorResponse;
//# sourceMappingURL=errorResponse.js.map