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
        /***************************************************************************
         *                                                                          *
         * If this app has CORS enabled (see `config/security.js`) with the         *
         * `allowCredentials` setting enabled, then you should uncomment the        *
         * `allowOrigins` whitelist below.  This sets which "origins" are allowed   *
         * to send cross-domain (CORS) requests to your Sails app.                  *
         *                                                                          *
         * > Replace "https://example.com" with the URL of your production server.  *
         * > Be sure to use the right protocol!  ("http://" vs. "https://")         *
         *                                                                          *
         ***************************************************************************/
        cors: {
            allowOrigins: [
                'http://localhost:5173',
                'https://didongtelecom.com',
                'http://didongtelecom.com'
            ],
            optionsSuccessStatus: 200
        },
    },
};