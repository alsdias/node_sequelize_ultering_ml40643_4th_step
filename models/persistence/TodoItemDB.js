/* coding: UTF-8
last update: 03/11/20 13:17:15
s.dias.andre.luiz@gmail.com # 03/11/20 13:17:15
*/
'use strict';
const PgSeqlDB = require('./PgSeqlDB');
var Sequelize = require('sequelize');
const Tools = require('../../utils/Tools');
const TodoDTO = require('../dto/TodoDTO');
const TodoItemDTO = require('../dto/TodoItemDTO');

class TodoItemDB {

    dbconfig;
    populate = false;
    pgSeqlDB;
    todoItemModel;
    sequelize;

    constructor(createTable) {
        this.createTable = createTable;
        this.pgSeqlDB = new PgSeqlDB();
        this.dbconfig = this.pgSeqlDB.dbconfig;
        this.sequelize = this.pgSeqlDB.sequelize;
        this.defineTodoItemModel();
        this.syncDb(createTable);
    }

    setCreateTable(createTable) {
        this.createTable = createTable;
    }

    setPopulate(populate) {
        this.populate = populate;
    }

    defineTodoItemModel() {
        this.todoItemModel = this.sequelize.define('todoitem', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            description: Sequelize.STRING,
            todo_fk: {
                type: Sequelize.INTEGER,
                allowNull: false,
                foreignKey: true
            }
        }, {
            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,
            tableName: 'todoitem'
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

    async insert(todoItemDTO) {
        return this.todoItemModel.create({
            description: todoItemDTO.description,
            todo_fk: todoItemDTO.fk
        }).then(function (todoitemSDO) {
            //console.log(todoitemSDO);
            return todoitemSDO;
        })
    }

    async truncate() {
        await this.todoItemModel.destroy({
            truncate: true
        }).then(function () {
            console.log('[***]: todositems truncated');
        });
    }

    async delete(todoItemDTO) {
        await this.todoItemModel.destroy({
            where: {
                id: todoItemDTO.id
            }
        }).then(function () {
            //console.log('[***]: todositem deleted');
        });
    }

    async update(todoItemDTO) {
        return await this.todoItemModel.update({
            description: todoItemDTO.description,
            todo_fk: todoItemDTO.fk
        }, {
            where: {
                id: todoItemDTO.id
            }
        });
    }

}

module.exports = TodoItemDB;