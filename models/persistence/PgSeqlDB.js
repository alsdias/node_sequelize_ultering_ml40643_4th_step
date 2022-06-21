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

    configuration() {
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
        } else {
            console.log('[WARN]: database configuration not defined, assuming default (dev): ' + Dbconfig.development.database);
            return Dbconfig.development;
        }
    }


    constructor() {
        this.dbconfig = this.configuration();
        this.sequelize = this.connection();
    }


    connection() {
        console.log('[INFO]: authenticating database: ' + this.dbconfig.database)
        let sequelize = new Sequelize({
            username: this.dbconfig.username,
            password: this.dbconfig.password,
            database: this.dbconfig.database,
            host: this.dbconfig.host,
            port: this.dbconfig.port,
            dialect: this.dbconfig.dialect
        });
        sequelize.authenticate(this.dbconfig).then(function () {
            console.log('[INFO]: database authenticated');
        }, function (err) {
            console.log('[EXCP]: database authentication failed due to: ' + err)
        });
        return sequelize;
    }


};


module.exports = PgSeqlDB;