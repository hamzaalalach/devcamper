"use strict";
exports.mailer = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.FROM_EMAIL,
    FROM_NAME: process.env.FROM_NAME,
};
exports.JWT = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || 30,
};
exports.uploader = {
    FILE_UPLOAD_LIMIT: process.env.FILE_UPLOAD_LIMIT || 1000000,
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH || './public/uploads',
};
exports.geocoder = {
    GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER,
    GEOCODER_API_KEY: process.env.GEOCODER_API_KEY,
};
exports.PORT = process.env.PORT || 5000;
exports.MONGO_URI = process.env.MONGO_URI;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
//# sourceMappingURL=index.js.map