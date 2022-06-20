'user strict';
var TodoDTO = require('../dto/TodoDTO');
var TodoitemDTO = require('../dto/TodoItemDTO');
var Tools = require('../../utils/Tools');
const Counter = require('../../utils/Counter');

/**
 * A helper to replace database service when not available or desirable.
 *
 * @class TodoHelper
 */
class TodoHelper {

  /**
   *Creates an instance of TodoHelper.
   * @memberof TodoHelper
   */
  constructor() {
    this.counterTodo = new Counter(1);
    this.counterItem = new Counter(2);
  }

  /**
   * Creates TodoDTO object.
   * Ex.: let todo =  todoHelper.todo('supermarket', ["weekly purchase", "monthly purchase"]);
   * @param {*} title
   * @param {*} descriptions
   * @returns TodoDTO
   * @memberof TodoHelper
   */
  todo(title, descriptions) {
    if(Tools.isNullEmpty(title)) {
      title = 'NONE';
      console.log('[WARN]: title null/empty.');
    }
    if(Tools.isNullEmptyArray(descriptions)) {
      descriptions = []
      console.log('[WARN]: descriptions null/empty.');
    }
    let todoId = this.counterTodo.add();
    let items = [];
    for (let i=0; i < descriptions.length; i++) {
      let item = new TodoitemDTO(todoId, this.counterItem.add(), descriptions[i]);
      items.push(item);
    }
    return new TodoDTO(todoId, title, items);
  }

  /**
   * console.log('----------------------------------------')
   * Creates an array of TodoDTO objects of each day of the week.
   *
   * Example:
   *
   * const TodoHelper = require('./models/TodoHelper');
   * const TodoDTO = require('./models/dto/TodoDTO');
   * let todoHelper = new TodoHelper();
   *
   * - RANDOMIC ITEM'S SIZE:
   * let todos =  todoHelper.populate();
   * todos.forEach(x => {console.log(x.print())});
   * console.log('----------------------------------------')
   *
   * - FIXED ITEM'S SIZE:
   * todos =  todoHelper.generate(2);
   * todos.forEach(x =&gt; {console.log(x.print())});
   *
   * - OUTPUT:
   * 1: Sunday, items[ 1:1: training, 1:2: soccer, 1:3: house cleaning, 1:4: family dinner, 1:5: webinar, 1:6: family appointment, ]
   * 2: Monday, items[ 2:7: studies, 2:8: house cleaning, 2:9: house maintenance, 2:10: play: theater, 2:11: hospital visit, 2:12: garage, ]
   * 3: Tuesday, items[ 3:13: hospital visit, ]
   * 4: Wednesday, items[ 4:14: condomium meeting, 4:15: job meeting, ]
   * 5: Thursday, items[ 5:16: soccer, 5:17: dog ride, 5:18: car maintenance, 5:19: studies, 5:20: house maintenance, ]
   * 6: Friday, items[ 6:21: volley, 6:22: house maintenance, 6:23: car maintenance, 6:24: family appointment, 6:25: training, 6:26: job meeting, 6:27: play: theater, ]
   * 7: Saturday, items[ 7:28: garage, ]
   * ----------------------------------------
   * 1: Sunday, items[ 1:1: travel, 1:2: dog ride, ]
   * 2: Monday, items[ 2:3: children's appointment, 2:4: family party, ]
   * 3: Tuesday, items[ 3:5: car maintenance, 3:6: children's appointment, ]
   * 4: Wednesday, items[ 4:7: play: theater, 4:8: family appointment, ]
   * 5: Thursday, items[ 5:9: house cleaning, 5:10: webinar, ]
   * 6: Friday, items[ 6:11: job meeting, 6:12: training, ]
   * 7: Saturday, items[ 7:13: condomium meeting, 7:14: training, ]
   *
   * @memberof TodoHelper
   * @returns TodoDTO array object.
   */
  generate(size) {

    let todoset = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let itemset = ["dog ride", "family dinner", "family party", "job meeting", "play: theater", "training", "house maintenance", "garage", "children's appointment", "travel", "hospital visit", "donation event", "house cleaning", "studies", "certification course", "soccer", "volley", "condomium meeting", "webinar", "car maintenance", "family appointment"]; 
    let itemLen = itemset.length;
    let todoHelper = new TodoHelper();
    let todos = [];
    for (var i = 0; i < todoset.length; i++) {

      let items = [];

      if (Tools.isNullEmpty(size) || size <= 0) {

        let itemSz = Tools.randomIntInc(itemLen/3, 1)[0];
        itemSz = itemSz == 0 ? 1 : itemSz;

        let itemIdxs = Tools.randomIntInc(itemLen - 1, itemSz);
        for (var k = 0; k < itemIdxs.length; k++) {
          items.push(itemset[itemIdxs[k]]);
        }
        let todo =  todoHelper.todo(todoset[i], items);
        todos.push(todo);

      } else {

        let itemIdxs = Tools.randomIntInc(itemLen - 1, size);
        for (var k = 0; k < itemIdxs.length; k++) {
          items.push(itemset[itemIdxs[k]]);
        }
        let todo =  todoHelper.todo(todoset[i], items);
        todos.push(todo);
      }
    }
    return todos;
  }

}

module.exports = TodoHelper;
