var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('sample.db');

router.get('/create', function(req,res,next) {
 res.render('create', { csrfToken: req.csrfToken() } );
})

router.post('/create', function(req, res, next) {

	var title = req.body.title;
	var text = req.body.text ;
	var date = Date.now();

    db.serialize(function() {
   	var stmt = db.prepare("INSERT INTO posts (title,text,date) VALUES (?,?,?)");
   	stmt.run(title,text,date);
   	stmt.finalize(); 
   });

res.send('ok');
});

router.get('/read', function(req,res,next) {
    db.serialize(function() {
        var stmt = db.all('SELECT * FROM posts', function(err,row) {
    	res.render('read', {posts : row});
    }); 
  });  
});

router.get('/update/:id', function(req,res,next) {
    
    var id = req.params.id;

    if (!isNaN(id)) {

    db.serialize(function() {
        var stmt = db.get('SELECT * FROM posts WHERE id=?', id , function(err,row) {
        res.render('update',{post : row, csrfToken: req.csrfToken()});
   }); 
  }); 
  
  } else { res.send('i need proper param'); }

});

router.post('/update', function(req,res,next) {
	var id = req.body.id;
	var title = req.body.title;
	var text = req.body.text;

	db.serialize(function() {
        var stmt = db.prepare('UPDATE posts SET title = ? , text = ? WHERE id = ?');
        stmt.run(title,text,id);
        stmt.finalize();
	});
	res.send('updated.');
});

router.get('/delete', function(req,res,next) {
   res.render('delete',{ csrfToken: req.csrfToken() });
});

router.post('/delete', function(req,res,next) {
	var id = req.body.id;
    db.serialize(function() {
      var stmt = db.prepare('DELETE FROM posts WHERE id = ?');
      stmt.run(id);
      stmt.finalize()
      res.send('deleted.');
    });
   
});

module.exports = router;
