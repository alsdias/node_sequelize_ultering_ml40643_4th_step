var Dbconfig = require('../../config/config.json');
var Sequelize = require('sequelize');

/**
 * Database service using Sequelize and PostgreSQL.
 *
 * @class PgSeqlDB
 */
class PgSeqlDB {

    dbconfig;
    sequelize;

    static configuration() {
        // process.env.APP_ENV captures what was set in the run.bat in the line: SET APP_ENV=dev
        if (process.env.APP_ENV == 'dev') {
            console.log('[INFO]: database configuration set to development.')
            return Dbconfig.development;
        } else if (process.env.APP_ENV == 'prod') {
            console.log('[INFO]: database configuration set to production.');
            return Dbconfig.production;
        } else if (process.env.APP_ENV == 'cloud') {
            console.log('[INFO]: database configuration set to cloud.');
            return Dbconfig.cloud;
        } else if (process.env.APP_ENV == 'test') {
            console.log('[INFO]: database configuration set to test environment.')
            return Dbconfig.test;
        }
        console.log('[WARN]: database configuration not defined, assuming default (dev): ' + Dbconfig.development.database);
        return Dbconfig.development;
    }


    constructor() {
        this.dbconfig = PgSeqlDB.configuration();
        this.sequelize = this.connection(this.dbconfig);
    }


    connection(config) {
        let sequelize = new Sequelize({
            username: config.username,
            password: config.password,
            database: config.database,
            host: config.host,
            port: config.port,
            dialect: config.dialect
        });
        sequelize.authenticate(config).then(function () {
            console.log('[INFO]: database authenticated');
        }, function (err) {
            console.log('[EXCP]: database authentication failed due to: ' + err)
        });
        return sequelize;
    }


};


module.exports = PgSeqlDB;