'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


module.exports = router;

router.get("/", function (req, res, next) {
  Page.findAll().then(function(pageData) {
    res.render('index', {pages: pageData});   
  }).catch(next);
});

router.post("/", function (req, res, next) {

  User.findOrCreate({
  where: {
    name: req.body.name,
    email: req.body.email
  }
})
.then(function (values) {

  var user = values[0];

  var page = Page.build({
    title: req.body.title,
    content: req.body.content,
    tags: (req.body.tags).split(" ")
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  });

})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);
  // User.findOrCreate( {
  //   where: {
  //     email: req.body.email,
  //     name: req.body.name
  //   }
  // }).spread(function (results, metadata) {
  //     results.save()
  //     var page = Page.build({
  //       title: req.body.title,
  //       content: req.body.content,
  //       status: req.body.status
  //     })
  //     // page.setAuthor(results.id);
  //     return page.save().then(function(page) {
  //       return page.setAuthor(results.id);
  //     })
  // }).then(function(savedPage){
  //   res.redirect(savedPage.route); // route virtual FTW
  // }).catch(next);


  // var page = Page.build({
  //   title: req.body.title,
  //   content: req.body.content,
  //   status: req.body.status
  // })
  // page.save().then(function(savedPage){
  //   res.redirect(savedPage.route); // route virtual FTW
  // }).catch(next);

});

router.get("/add", function (req, res) {
  res.render('addpage');
});

router.get("/users", function (req, res, next) {
  User.findAll({}).then(function(userData) {
    res.render('users', {users: userData});   
  }).catch(next);
})

router.get("/users/:id", function (req, res, next) {

  var p1 = Page.findAll({
    where: {
      authorId: req.params.id
    }
  })

  var p2 = User.findAll({
    where: {
      id: req.params.id
    }
  })

  // .then(function(pageData) {
    
    // console.log(pageData)
    // res.render('userpage', {pages: pageData });   
  // }).catch(next);

  Promise.all([p1, p2]).then(function(pageData) {
    res.render('userpage', {pages: pageData[0], user: pageData[1][0].dataValues }); 
}).catch(next);

});

router.get("/search", function (req, res) {
  res.json(req.query)
 
});

// router.get("/search/:tag", function (req, res, next) {
//   console.log("Hello");
//   Page.findAll({
//       // where: {
//       //   tags: req.params.tag
//       // }
//     }).then(function(pageData) {
//       console.log(pageData)
//       res.send("Hi");
//     })

//     // .then(function(pageData) {
//     //   // console.log(pageData);
//     //   res.render('wikipage', {page: pageData[0].dataValues});   
//     // }).catch(next);
//   });

router.get("/:urlTitle", function (req, res, next) {
  Page.findAll({
    where: {
      urlTitle: req.params.urlTitle
    }
  }).then(function(pageData) {
    pageData[0].getAuthor({}).then(function(userData) {
      res.render('wikipage', {page: pageData[0].dataValues, user: userData.dataValues});  
    })
  })

  // .then(function(pageData) {
  //   // console.log(pageData);
  //   res.render('wikipage', {page: pageData[0].dataValues});   
  // }).catch(next);
})




router.post("/users/", function (req, res, next) {
  res.send('post users');
});

router.put("/users/:id", function (req, res, next) {
  res.send('post ' + req.params.id);
});

router.delete("/users/:id", function (req, res, next) {
  res.send('delete ' + req.params.id);
});