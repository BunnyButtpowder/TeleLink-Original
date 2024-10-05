require('dotenv').config();

module.exports = {
    datastores: {
        default: {
            adapter: 'sails-mysql',
            url: process.env.DATABASE_URL,
        }
        
    },
    port: process.env.PORT || 1337,
};