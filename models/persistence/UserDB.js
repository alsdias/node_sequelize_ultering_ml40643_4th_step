/**
 * @File   : UserDAO.js
 * @Author :  ()
 * @Link   : 
 * @Date   : 17/06/2022 16:20:20
 */

const PgSeqlDB = require('./PgSeqlDB');
var Sequelize = require('sequelize');
const ConfigSvc = require('../../utils/ConfigSvc');

/**
 * Database service using Sequelize and PostgreSQL for User table.
 *
 * @class UserDB
 */
class UserDB {

    dbconfig;
    pgSeqlDB;
    userModel;
    sequelize;

    // pgSeqlDB.showConfig();

    constructor(createTable) {
        this.createTable = createTable;
        this.pgSeqlDB = new PgSeqlDB();
        this.dbconfig = this.pgSeqlDB.dbconfig;
        this.sequelize = this.pgSeqlDB.sequelize;
        this.defineUserModel();
        this.syncDb(createTable);
    }

    setCreateTable(createTable) {
        this.createTable = createTable;
    }

    setPopulate(populate) {
        this.populate = populate;
    }

    defineUserModel() {
        this.userModel = this.sequelize.define('User', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            username: Sequelize.STRING,
            password: Sequelize.STRING
        }, {
            tableName: 'user', // this will define the table's name
            //timestamps: false           // this will deactivate the timestamp columns
        });

    }

    /**
     * @param  {boolean} createTable if true, creates the tables.
     */
    syncDb(createTable) {
        this.sequelize.sync({
                force: createTable
            })
            .then(function (err) {
                //console.log('[INFO]: sequelize sync done');
            }, function (err) {
                console.log('An error occurred while creating the table:', err);
            });
    }


    insert(name, pass) {
        this.userModel.create({
            username: name,
            password: pass
        }).then(function (user) {
            console.log('[INFO]: ' + user.dataValues.username + ' persisted');
        });
    }

    populate() {
        this.insert("John Doe", "secret1");
        this.insert("Mary Doe", "secret2");
        this.insert("Jane Doe", "secret3");
    }

    showConfig() {
        console.log(this.dbconfig);
    }

    findById(id) {
        return this.userModel.findByPk(id)
    }

    findByName(name) {
        return this.userModel.findAll({
            where: {
                username: name
            }
        })
    }

    findAll(res) {
        return this.userModel.findAll()
    }

    deleteById(id) {
        this.userModel.destroy({
            truncate: {
                cascade: true,
                where: {
                    id: id
                }
            }
        });
    }

    delete() {
        this.userModel.destroy({
            truncate: {
                cascade: true
            }
        });
    }

}

module.exports = UserDB;