'use strict';

class TodoItemDTO {

  constructor(fk, id, description) {
    this.fk = fk;
    this.id = id;
    this.description = description;
  }

  static fromSDO(todoitemSDO) {
    if(todoitemSDO === undefined) {
      return new TodoItemDTO('', '', '');
    }
    return new TodoItemDTO(todoitemSDO.dataValues.todo_fk , todoitemSDO.dataValues.id , todoitemSDO.dataValues.description, null);
  }

  print() {
    return this.fk + ':' + this.id + ': ' + this.description;
  }

}

module.exports = TodoItemDTO;