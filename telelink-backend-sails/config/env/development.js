require('dotenv').config();

module.exports = {
    datastores: {
        default: {
            adapter: 'sails-mysql',
            url: process.env.DATABASE_URL,
        }
    },
    port: process.env.PORT || 1337,
    security: {
        cors: {
            allowOrigins: [
                'http://localhost:5173',
                'https://didongtelecom.com',
                'http://didongtelecom.com'
            ],
            allowRequestHeaders: 'Authorization, Content-Type',
            allowCredentials: true,
            optionsSuccessStatus: 200
        },
    },
};