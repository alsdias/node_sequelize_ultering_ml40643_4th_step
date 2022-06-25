/**
 * @File   : userSvc.js
 * @Author :  ()
 * @Link   : 
 * @Date   : 16/06/2022 22:27:12
 */

const UserDB = require('../persistence/UserDB');

class UserSvc {

    userDB;
    createTable = false;

    constructor() {
        this.userDB = new UserDB();
    }

    setCreateTable(createTable) {
        this.createTable = createTable;
    }

    populate() {
        this.userDB.populate();
    }

    delete() {
        this.userDB.delete();
    }

    setPopulate(populate) {
        this.populate = populate;
    }

    async list(res) {
        return await this.userDB.findAll(res);
    }


    async findById(id) {
        return await this.userDB.findById(id).then(function (user) {
            console.log('------------------------------------------');
            console.log('\n[INFO]: found: ' + user.id + ", " + user.username + '\n');
        });
    }

    async findByName(name) {
        return await this.userDB.findByName(name).then(function (data, err) {
            if (!data) {
                console.log('------------------------------------------');
                console.log('[FAIL]: user instance not found due to: ' + err);
                console.log('------------------------------------------');
            } else {
                //console.log(data);
                if(data.length > 0) {

                }
                for (let u in data) {
                    console.log(data[u].dataValues);
                }
            }
        });
    }

    async findAll(res) {
        return await this.userDB.findAll(res).then(function (data, err) {
            if (!data) {
                console.log('------------------------------------------');
                console.log('[FAIL]: user instance not found due to: ' + err);
                console.log('------------------------------------------');
            } else {
                let list = [];
                for (let u of data) {
                    list.push(u.dataValues);
                }
                return res.render('usersList', {
                    title: 'USERS',
                    msg: '',
                    users: list
                });

            }
        });
    }
}

module.exports = UserSvc;