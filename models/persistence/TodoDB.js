const pgSeqlDB = require('./PgSeqlDB');
var Sequelize = require('sequelize');

const TodoItemDB = require('./TodoItemDB');
const Tools = require('../../utils/Tools');
const TodoDTO = require('../dto/TodoDTO');
const TodoItemDTO = require('../dto/TodoItemDTO');

/**
 * Database service using Sequelize and PostgreSQL for Todo table.
 *
 * @class UserDB
 */
class TodoDB {

    dbconfig;
    pgSeqlDB;
    todoModel;
    sequelize;
    todoItemDB;

    constructor(createTable) {
        this.createTable = createTable;
        this.pgSeqlDB = new pgSeqlDB();
        this.dbconfig = this.pgSeqlDB.dbconfig;
        this.sequelize = this.pgSeqlDB.sequelize;
        this.todoItemDB = new TodoItemDB();
        this.defineTodoModel();
        this.syncDb(createTable);
    }

    setCreateTable(createTable) {
        this.createTable = createTable;
    }

    defineTodoModel() {
        let TodoItemsDefinition = this.todoItemDB.todoItemModel;
        this.todoModel = this.sequelize.define('todo', {
            title: Sequelize.STRING
        }, {
            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,
            tableName: 'todo'
        });
        TodoItemsDefinition.belongsTo(this.todoModel, {
            foreignKey: 'todo_fk',
            allowNull: false
        });
        this.todoModel.hasMany(TodoItemsDefinition, {
            foreignKey: 'todo_fk',
            allowNull: false
        })
        return this.todoModel;
    }


    /**
     * @param  {boolean} createTable if true, creates the tables.
     */
    syncDb(createTable) {
        this.sequelize.sync({
                force: createTable
            })
            .then(function (err) {
            }, function (err) {
                console.log('An error occurred while creating the table:', err);
            });
    }

    static stringfy(seqlDO) {
        if (seqlDO.dataValues === undefined) {
            return "insertion failure"
        }
        return JSON.stringfy('id: ' + seqlDO.dataValues.id + ', ' + seqlDO.dataValues.title);
    }

    bulk(entities) {
        this.todo.bulkCreate(entities, null)
            .then(function (models) {
                console.log(models);
            });
    }

    async list(res) {
        return this.todoModel.findAll({ 
            include: [this.todoItemDB.todoItemModel],
            order: [['id', 'desc'],  [this.todoItemDB.todoItemModel, 'id']]
        });
    }

    async listByQuery(res) {
        let query = "select t.id, t.title as title, i.id as i_id, i.description as i_desc from todo t left join todoitem i on t.id = i.todo_fk order by t.id, i.id";
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async selectTitles() {
        return await this.sequelize.query("SELECT title FROM todo", {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async selectById(id) {
        let query = "select t.id, t.title as title, i.id as i_id, i.description as i_desc from todo t left join todoitem i on t.id = i.todo_fk where t.id = " + id + " order by t.id, i.id";
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async selectTodoById(id) {
        return await this.todoModel.findOne({
            include: [this.todoItemDB.todoItemModel],
            where: { id: id } 
        });
    }

    async selectByTitle(title) {
        let query = "select t.id, i.id as i_id, i.description as i_desc from todo t inner join todoitem i on t.id = i.todo_fk where t.title = '" + title + "'";
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    /**
     * Persists a todo entity and optionally its items.
     * todoSDO stands for todo Sequelize Data Object
     * @param {*} title
     * @param {*} description
     * @returns
     * @memberof TodoDAO
     */
    async insert(todoDTO) {
        if (Tools.isNullEmpty(todoDTO.title)) {
            return '';
        }
        return this.todoModel.create({
            title: todoDTO.title
        }).then(function (todoDTO) { // sequelize returns it SDO (Sequelize Data Object)
            todoDTO.id = TodoDTO.fromSDO(todoDTO).id;
            let todoItemDB = new TodoItemDB();
            let todoItemDTO = new TodoItemDTO(todoDTO.id, null, ' ')
            todoItemDB.insert(todoItemDTO).then(function (todoitemsDTO) {
                todoItemDTO = TodoItemDTO.fromSDO(todoitemsDTO);
            });
            return todoDTO;
        });
    }

    async update(todoDTO) {
        await this.todoModel.update({
            title: todoDTO.title
        }, {
            where: {
                id: todoDTO.id
            }
        });
    }

    async truncate() {
        await this.todoModel.destroy({
            truncate: {
                cascade: true,
                where: {}
            }
        });
    }

    async deleteByTitle(title) {
        let query = "with todos as (SELECT id FROM todo where title = '" + title + "') ";
        query += " delete from todoitem where todo_fk in (select id from todos);"
        query += " delete FROM todo where title = '" + title + "'";
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async delete(id) {
        await this.todoModel.destroy({
            truncate: {
                cascade: true,
                where: {
                    id: id
                }
            }
        });
    }

    async deleteById(id) {
        let query = "delete from todoitem where todo_fk = " + id + "; ";
        query += " delete FROM todo where id = " + id;
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async deleteByTitle(title) {
        await this.todoModel.destroy({
            where: {
                title: title
            }
        });
    }

    async deleteAll() {
        let query = 'delete from todoitem; delete from todo';
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

    async statistics() {
        let query = 'select t.title, count(t.title) from todo t inner join todoitem i on t.id = i.todo_fk group by t.title';
        return await this.sequelize.query(query, {
            type: this.sequelize.QueryTypes.SELECT
        });
    }

}

module.exports = TodoDB