/* coding: UTF-8
last update: 03/11/20 13:23:08
target: todo.js: todo's routing.
s.dias.andre.luiz@gmail.com # 03/11/20 13:23:08
*/
'use strict';
const DbSvc = require('./DbSvc');
const TodoDB = require('../persistence/TodoDB');
const TodoItemDB = require('../persistence/TodoItemDB');
const TodoHelper = require('./TodoHelper');
const Tools = require('../../utils/Tools');

/**
 * target: Todo's business service.
 *
 * @class TodoSvc
 */
class TodoSvc extends DbSvc {

	todoDB;
	todoItemDB;
	todoHelper;

	constructor() {
		super();
		this.todoDB = new TodoDB();
		this.todoItemDB = new TodoItemDB();
		this.todoHelper = new TodoHelper();
	}

	createDb() {
		let timeoutPeriod = 3000;
		let hasDbCreation = ConfigSvc.checkDbCreation();
		if (hasDbCreation) {
			this.model();
			this.pgSeqlDB.sync(hasDbCreation);
			setTimeout(function () {
				ConfigSvc.disableDbCreation();
			}, timeoutPeriod);
		}
	}

	model() {
		this.TodoDB.model();
	}


	async list(res) {
		this.todoDB.list(res).then(function (data, err) {
			if (!data) {
				console.log('------------------------------------------');
				console.log('[FAIL]: user instance not found due to: ' + err);
				console.log('------------------------------------------');
				return;
			}
			let olist = [];
			for(let todo of data) {
				olist.push(todo.dataValues);
			}
			//console.log(data)
			return res.render('todos', {
				title: 'My task list',
				msg: '',
				sdos: olist
			});
		});
	}

	selectTitles(res) {
		this.todoDB.selectTitles().then(function (titles) {
			return res.status(200).send(JSON.stringify(titles));
		});
	}

	selectByTitle(title, res) {
		this.todoDB.selectByTitle(title).then(function (sdo) {
			return res.status(200).send(JSON.stringify(sdo));
		});
	}


	insert(todoDTO) {
		return this.todoDB.insert(todoDTO).then(function (todoDTO) {
			return todoDTO;
		});
	}

	insertItem(todoItemDTO, res) {
		this.todoItemDB.insert(todoItemDTO).then(function (sdo) {
			res.status(200).send(sdo);
		});
	}

	update(todoDTO, res) {
		this.todoDB.update(todoDTO).then(function (sdo) {
			res.send(sdo);
		});
	}

	updateitem(todoItemDTO) {
		return this.todoItemDB.update(todoItemDTO);
	}

	// async editById(id, res) {
	// 	await this.todoDB.list(res).then(function (data, err) {
	// 		if (!data) {
	// 			console.log('------------------------------------------');
	// 			console.log('[FAIL]: user instance not found due to: ' + err);
	// 			console.log('------------------------------------------');
	// 		}
	// 		console.log(data)
	// 		let olist = [];
	// 		for(let todo of data) {
	// 			olist.push(todo.dataValues);
	// 		}
	// 		return res.render('todos_edit', {
	// 			id: id,
	// 			title: data[0].title,
	// 			sdos: data
	// 		});
	// 	});
	// }

	editByIdRedirecting(id, res) {
		this.todoDB.selectById(id).then(function (sdos) {
			// return res.redirect('/todo/edit/' + id);
			return res.redirect('/todo/list');
		});
	}

	editById(id, res) {
		this.todoDB.selectTodoById(id).then(function (todo) {
			console.log(todo)
			return res.render('todos_edit', {
				id: id,
				title: todo.title,
				sdos: todo
			});
		});
	}

	editByTitle(title, res) {
		this.todoDB.selectByTitle(title).then(function (sdos) {
			//console.log(JSON.stringify(sdos));
			res.render('todos_edit', {
				title: title,
				sdos: sdos
			});
		});
	}


	deleteAll() {
		this.todoDB.deleteAll();
	}

	deleteById(id, res) {
		this.todoDB.deleteById(id).then(function (sdo) {
			return res.send(sdo);
		});
	}

	deleteByTitle(title, res) {
		this.todoDB.deleteByTitle(title).then(function (answer) {
			return res.status(200).send(JSON.stringify(answer));
		});
	}


	deleteitem(todoItemDTO) {
		return this.todoItemDB.delete(todoItemDTO);
	}

	/**
	 * Populates the database with todos entities.
	 *
	 * @param {*} weekTitle
	 * @param {*} res
	 * @returns if successful, returns positive total of performed entities, otherwise negative total of performed entities.
	 * @memberof DbSvc
	 */
	populate(month, weekTitle) {

		//  - RANDOMIC ITEM'S SIZE:
		//let todos =  todoHelper.populate();
		//  - FIXED ITEM'S SIZE:
		let todos = this.todoHelper.generate();
		if (Tools.isNullEmptyArray(todos)) {
			return '[FAIL]: population skipped: no todo to persist';
		}
		let promises = [];
		let countTodos = 0;
		let countTodos2 = 0;
		let success = '<h3>Totals</h3>';
		todos.forEach(todoDTO => {
			countTodos += 1;
			todoDTO.title = month + '_' + todoDTO.title + '_' + weekTitle;
			promises.push(this.todoDB.insert(todoDTO));
		});
		if (promises.length == 0) {
			return res.status(200).send('[FAIL]');
		}
		promises.forEach(promise => {
			countTodos2 += 1;
		});

		if (countTodos == countTodos2) {
			return countTodos;
		}
		return -countTodos2;
	}


	statistics(res) {
		return this.todoDB.statistics().then(function (stats) {
			let style = 'style="bgcolor="white" border="0px" cellpadding="6px" cellspacing="3px"';
			let table = '<h3>Statistics</h3><table ' + style + '><tr style="text-align: left"><th>Title</th><th>Total</th></tr>';
			let tableEnd = '</table>';
			stats.forEach(stat => {
				table += '<tr><td>' + stat.title + '</td><td>' + stat.count + '</td></tr>';
			});
			return res.status(200).send(table + tableEnd);
		});
	}

}

module.exports = TodoSvc;