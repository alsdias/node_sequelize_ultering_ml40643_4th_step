/* coding: UTF-8
last update: 03/11/20 13:23:08
target: todo.js: todo's routing.
s.dias.andre.luiz@gmail.com # 03/11/20 13:23:08
*/


const express = require('express');
const router = express.Router();
const TodoDTO = require('../models/dto/TodoDTO');
const TodoItemDTO = require('../models/dto/TodoItemDTO');
const TodoHelper = require('../models/business/TodoHelper');
const TodoSvc = require('../models/business/TodoSvc');
const TodoItemSvc = require('../models/business/TodoItemSvc');
const Tools = require('../utils/Tools');
const path = require('path');
//const fs = require('fs');

var todoSvc = new TodoSvc();


router.post('/simulate', function (req, res, next) {
  let todoHelper = new TodoHelper();
  let weeks = Tools.toNumber(req.body.weeks);
  let month = 'april';
  let counter = 0;
  let success = true;
  for (let i = 0; i < weeks; i++) {
    let count = todoSvc.populate(month, '' + (i + 1));
    counter += count;
  }
  let ans = '';
  if (success) {
    ans += '<h5>[SUCCESS]:</h5>Persisted ' + counter + ' todos.</br></br>' + Tools.timestamp() + '</br>';
  } else {
    ans += '<h3>[FAIL]:</h3>Persisted ' + counter + ' todos, but expeted ' + (weeks * 7) + '.</br></br>' + Tools.timestamp() + '</br>';
  }
  res.send(ans);
});

router.get('/', function (req, res, next) {
  todoSvc.list(res);
});

router.get('/list', function (req, res, next) {
  let svc = new TodoSvc();
  svc.list(res);
});

router.get('/tools', function (req, res, next) {
  res.render('todos_tools', {
    title: 'todos_tools'
  });
});

router.post('/truncateDelete', function (req, res, next) {
  todoSvc.deleteAll();
  res.status(200).send("done: todos' data  cleaned — " + Tools.timestamp());
});


router.get('/simulation/s/:weeks', function(req, res, next) {
  let todoHelper = new TodoHelper();
  let weeks = req.params.weeks;
  //  - RANDOMIC ITEM'S SIZE:
  //let todos =  todoHelper.populate();
  //  - FIXED ITEM'S SIZE:
  todos =  todoHelper.populate(weeks);
  //todos.forEach(x => {console.log(x.print())});
  res.render('todos', { title: 'TODOS', todos: todos });
});

router.get('/populate/p/:weeks', function(req, res, next) {
  let month = 'april';
  let weeks = req.params.weeks;
  let counter = 0;
  let success = true;
  for(let i = 1; i <= weeks; i++) {
    let count = todoSvc.populate(month, '' + i);
    console.log('***** ' + count)
    if(count > 0) {
      counter += count;
    } else {
      success = false;
      counter += -count;
    }
  }
  if(success) {
    return res.status(200).send('<h2>[SUCCESS]:</h2>Persisted ' + counter + ' todos.</br></br>' + Tools.timestamp() + '</br>');
  }
  return res.status(200).send('<h2>[FAIL]:</h2>Persisted ' + counter + ' todos, but expeted ' + (weeks * 7) + '.</br></br>' + Tools.timestamp() + '</br>');
});

router.post('/simulate', function(req, res, next) {
  let todoHelper = new TodoHelper();
  let weeks = Tools.toNumber(req.body.weeks);
  let month = 'april';
  let counter = 0;
  let success = true;
  for(let i = 0; i < weeks; i++) {
    let count = todoSvc.populate(month, '' + (i + 1));
    counter += count;
  }  
  let ans = '';
  if(success) {
    ans += '<h5>[SUCCESS]:</h5>Persisted ' + counter + ' todos.</br></br>' + Tools.timestamp() + '</br>';
  } else {
    ans += '<h3>[FAIL]:</h3>Persisted ' + counter + ' todos, but expeted ' + (weeks * 7) + '.</br></br>' + Tools.timestamp() + '</br>';
  }
  res.send(ans);
});

router.get('/tools', function(req, res, next) {
  res.render('todos_tools', { title: 'todos_tools'});
});

router.get('/insert', function(req, res, next) {
  todoSvc.insert();
  res.status(200).send("population done");
});

router.post('/create', function(req, res, next) {
  let id = req.body.id;
  let title = req.body.title;
  let todoDTO = new TodoDTO(id , title, null)
  todoSvc.insert(todoDTO, res);
});

router.post('/createbytitle', function(req, res, next) {
  let title = req.body.titlecreation;
  let todoDTO = new TodoDTO(null , title, [])
  todoSvc.insert(todoDTO, res).then(function (todoDTO){
    todoSvc.editByIdRedirecting(todoDTO.id, res);
  });
});

router.post('/createitem', function(req, res, next) {
  let fk = req.body.fk;
  let description = req.body.desc;
  let todoItemDTO = new TodoItemDTO(fk , null, description)
  todoSvc.insertItem(todoItemDTO, res);
});

router.get('/', function(req, res, next) {
  todoSvc.list(res);
});

router.get('/listall', function(req, res, next) {
  todoSvc.list(res);
});

router.get('/titles', function(req, res, next) {
  todoSvc.selectTitles(res);
});

router.get('/statistics', function(req, res, next) {
  todoSvc.statistics(res);
});

router.post('/truncateDelete', function(req, res, next) {
  todoSvc.truncateDelete();
  res.status(200).send("done: todos' data  cleaned — " + Tools.timestamp());
});

router.post('/delall', function(req, res, next) {
  todoSvc.delall();
  res.status(200).send('full deletion operation done — ' + Tools.timestamp());
});

router.get('/delbytitle/:title', function(req, res, next) {
  let title = req.params.title;
  todoSvc.deleteByTitle(title, res);
});

router.post('/deletebyid', function(req, res, next) {
  let id = req.body.id;
  todoSvc.deleteById(id, res);
});

router.get('/selbytitle/:title', function(req, res, next) {
  let title = req.params.title;
  todoSvc.selectByTitle(title, res);
});

router.get('/edit/:id', function(req, res, next) {
  let id = req.params.id;
  todoSvc.editById(id, res);
});

// router.post('/edit', function(req, res, next) {
//   let id = req.body.id;
//   todoSvc.editById(id, res);
// });

router.post('/update', function(req, res, next) {
  let id = req.body.id;
  let title = req.body.title;
  todoDTO = new TodoDTO(id , title, null)
  todoSvc.update(todoDTO, res);
});

router.post('/updateitem', function(req, res, next) {
  let fk = req.body.fk;
  let id = req.body.id;
  let desc = req.body.desc;
  let todoItemDTO = new TodoItemDTO(fk, id , desc);
  todoItemSvc = new TodoItemSvc();
  todoItemSvc.update(todoItemDTO);
  todoSvc.updateitem(todoItemDTO).then(function(success){
    return res.send(JSON.stringify({success: success, fk: fk, iid: id, desc: desc}));
  });
});

router.post('/deleteitem', function(req, res, next) {
  let fk = req.body.fk;
  let id = req.body.id;
  let desc = req.body.desc;
  let todoItemDTO = new TodoItemDTO(fk, id , desc);
  todoItemSvc = new TodoItemSvc();
  todoItemSvc.update(todoItemDTO);
  todoSvc.deleteitem(todoItemDTO).then(function(success){
    return res.send(JSON.stringify({success: success, fk: fk, id: id, desc: desc}));
  });
});

// DOWNLOAD EXAMPLE
router.get('/images/todo_150.jpg', function(req, res, next) {
  let filePath = path.join(__dirname, 'storage', 'todo_150.jpg');
  let check = fs.readFileSync(__dirname + '/storage/todo_150.jpg');
  res.attachment('/storage/todo_150.jpg'); // The name of the file to be saved as. Eg Picture.jpg
  res.status(200).send(check);
});


module.exports = router;