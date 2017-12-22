var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose') //mongo connection

router.get('/', function(req, res, next) {

  res.render('create', { title: 'Add Development' });
});
exports.create = function ( req, res ){
  new Development({
    name    : req.body.development_name,
    developmentid: req.body.development_id,
    description: req.body.description,
    imagepath: req.body.imagepath,
    dateCreated : Date.now()
  }).save( function( err, todo, count ){
    res.redirect( '/' );
  });
};
module.exports = router;
