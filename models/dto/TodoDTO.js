'use strict';
const Tools = require('../../utils/Tools');

class TodoDTO {

  constructor(id, title, items) {
    this.id = id;
    this.title = title;
    if(!Tools.isNullEmptyArray(items)) {
      this.items = items;
    } else {
      this.items = [];
    }
  }

  print() {
    let itemset = '';
    if(this.items === undefined || this.items === null) {
      return this.id + ': ' + this.title + ', items: empty';
    }
    for(let i = 0; i < this.items.length; i++) {
      itemset = itemset + this.items[i].print() + ', ';
    }
    return this.id + ': ' + this.title + ', items[ ' + itemset + ']';
  }

  static toDTO(todoDAO) {
    if(todoDAO === undefined) {
      return new TodoDTO('', '', []);
    }
    return new TodoDTO(todoDAO.id , todoDAO.title, []);
  }

  static fromSDO(todoSDO) {
    if(todoSDO === undefined) {
      return new TodoDTO('', '', []);
    }
    return new TodoDTO(todoSDO.dataValues.id , todoSDO.dataValues.title, []);
  }

}

module.exports = TodoDTO;
