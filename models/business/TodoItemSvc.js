/* coding: UTF-8
last update: 03/11/20 13:23:08
target: todo.js: todo's routing.
s.dias.andre.luiz@gmail.com # 03/11/20 13:23:08
*/
'use strict';
const DbSvc = require('./DbSvc');
const TodoItemDB = require('../persistence/TodoItemDB');
/**
 * target: Todoitem's business service.
 *
 * @class TodoitemSvc
 */
class TodoItemSvc extends DbSvc {

  todoItemDB;

  constructor() {
    super();
    this.todoItemDB =  new TodoItemDB;
  }

  update(todoItemDTO) {
		this.todoItemDB.update(todoItemDTO);
	}

}

module.exports =  TodoItemSvc;