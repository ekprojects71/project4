const { Pool } = require("pg");

const pool = new Pool({
    //using manual connection for dev purposes, production will use heroku connection string ENV
    connectionString: "postgres://ykxkqdyelewnjc:d7334cdd2982dc2c52c02e224bf0f97e966cfbe97b7c14297fd27259e4abe99b@ec2-18-233-32-61.compute-1.amazonaws.com:5432/d2cs5prq9llaim",
    ssl: {
        rejectUnauthorized: false //in production, you would just set ssl to true, this is for development only
    }
});

module.exports = pool;