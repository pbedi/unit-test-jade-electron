var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose') //mongo connection
//var Development = mongoose.model('Development');
var Development = require('../model/db');
var bodyParser = require('body-parser') //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
//var aData = require('/javascripts/developments.json');
var aData = [];
 //router.get('/', index.all);
/* GET home page. */

/*Development.create({
            name : 'London Dock',
            developmentid : '4',
            description : 'London Dock development',
            imagepath : '',
            isactive: 1
        }, function (err, dbrow) {
          if (err) {
                //  res.send("There was a problem adding the information to the database.");
                console.log('recoord insertion failed');
              } else {
                console.log('recoord inserted');
              }
        });*/
//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}));



router.route('/')
  .get( function(req, res, next) {

      readJSONFile(path.join(__dirname,"../public/javascripts/developments.json"), function (err, json) {
        if(err) {throw err ;}
        developments = json;
        Development.find({},function(err, dbDevelopments){
          if(err) {
            return console.error(err);
          } else {
            //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
            res.format({
               html: function(){
                 res.render('index', { title: 'Express' , data: developments, dbData: dbDevelopments });
               },
               //JSON response will show all records in JSON format
               json: function(){
                  res.json(dbDevelopments);
              }
            });
          }
      })

    });

})
//POST a new development
.post(function(req, res) {
  // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
  var name = req.body.development_name;
  var developmentid = req.body.development_id
  var description = req.body.description;
  var imagepath = req.body.imagepath;
  var isactive = 1;
  //call the create function for our database
  Development.create({
      name : name,
      developmentid : developmentid,
      description : description,
      imagepath : imagepath,
      isactive: isactive
    }, function (err, dbrow) {
      if (err) {
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function() {
            res.send("There was a problem adding the information to the database.");
          },
          json: function(){
            res.send(err);
          }
        });
      } else {
        //Development has been created
        //console.log('POST creating new Development: ' + dbrow);
        res.format({
          //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
          html: function() {
            // If it worked, set the header so the address bar doesn't still say /add
            res.location("index");
            // And forward to success page
            res.redirect("/");
          },
          //JSON response will show the newly created blob
          json: function(){
              res.json({message:'Development successfully added!',development:dbrow});
          }
        });
      }

  })
});

/* GET New Development page. */
router.get('/new', function(req, res) {
    res.render('new', { title: 'Add New Development' });
});
/* GET users listing. */
router.get('/users', function(req, res, next) {
  var aData = [{"name":"190 Strand"},{"name":"375 Kensignton"}];
  res.render('users', { title: 'Users', data: aData });
});
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  //find the ID in the Database
  Development.findById(id, function (err, development) {
    //if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + ' was not found');
      res.status(404)
      var err = new Error('Not Found');
      err.status = 404;
      res.format({
          html: function(){
              next(err);
           },
          json: function(){
                 res.json({message : err.status  + ' ' + err});
           }
      });
    //if it is found we continue on
    } else {
      //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      //console.log(development);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});

router.route('/:id')
  .get(function(req, res) {
    Development.findById(req.id, function (err, development) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + development._id);
        var developmentdt = development.dateCreated.toISOString();
        developmentdt = developmentdt.substring(0, developmentdt.indexOf('T'));
        res.format({
          html: function(){
              res.render('show', {
                "developmentdt" : developmentdt,
                "development" : development
              });
          },
          json: function(){
              res.json(development);
          }
        });
      }
    });
  });

  router.route('/:id/edit')
  	//GET the individual development by Mongo ID
  	.get(function(req, res) {
  	    //search for the development within Mongo
  	    Development.findById(req.id, function (err, development) {
  	        if (err) {
  	            console.log('GET Error: There was a problem retrieving: ' + err);
  	        } else {
  	            //Return the development
  	            //console.log('GET Retrieving ID: ' + development._id);
                var developmentdt = development.dateCreated.toISOString();
                developmentdt = developmentdt.substring(0, developmentdt.indexOf('T'));
  	            res.format({
  	                //HTML response will render the 'edit.jade' template
  	                html: function(){
  	                       res.render('edit', {
  	                          title: 'Development: ' + development.developmentid,
                              "developmentdt" : developmentdt,
  	                          "development" : development
  	                      });
  	                 },
  	                 //JSON response will return the JSON output
  	                json: function(){
  	                       res.json(development);
  	                 }
  	            });
  	        }
  	    });
  	})
  	//PUT to update a development by ID
  	.put(function(req, res) {
  	    // Get our REST or form values. These rely on the "name" attributes
        var name = req.body.development_name;
        var developmentid = req.body.development_id
        var description = req.body.description;
        var imagepath = req.body.imagepath;
        var isactive = true;

  	    //find the document by ID
  	    Development.findById(req.id, function (err, development) {
  	        //update it
  	        development.update({
              name : name,
              developmentid : developmentid,
              description : description,
              imagepath : imagepath,
              isactive: isactive
  	        }, function (err, devID) {
  	          if (err) {
  	              res.send("There was a problem updating the information to the database: " + err);
  	          }
  	          else {
  	          //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.

                      res.format({
  	                      html: function(){
  	                           res.redirect("/" + development._id);
  	                     },
  	                     //JSON responds showing the updated values
  	                    json: function(){
                          //This step is to read updated values/ data
                          Development.findById(req.id, function (err, development) {
  	                           res.json({ message: "Development successfully updated!", development });
                             });
  	                     }
  	                  });
  	           }
  	        })
  	    });
  	})
  	//DELETE a development by ID
    router.route('/:id/remove')
      //GET the individual development by Mongo ID
      .get(function(req, res) {
          //search for the development within Mongo
          Development.findById(req.id, function (err, development) {
              if (err) {
                  console.log('GET Error: There was a problem retrieving: ' + err);
              } else {
                  //Return the development
                  console.log('GET Retrieving ID: ' + development._id);
                  var developmentdt = development.dateCreated.toISOString();
                  developmentdt = developmentdt.substring(0, developmentdt.indexOf('T'));
                  res.format({
                      //HTML response will render the 'edit.jade' template
                      html: function(){
                             res.render('delete', {
                                title: 'Development: ' + development.developmentid,
                                "developmentdt" : developmentdt,
                                "development" : development
                            });
                       },
                       //JSON response will return the JSON output
                      json: function(){
                             res.json(development);
                       }
                  });
              }
          });
      })
  	.delete(function (req, res){
  	    //find development by ID
  	    Development.findById(req.id, function (err, development) {
  	        if (err) {
  	            return console.error(err);
  	        } else {
  	            //remove it from Mongo
  	            development.remove(function (err, development) {
  	                if (err) {
  	                    return console.error(err);
  	                } else {
  	                    //Returning success messages saying it was deleted
  	                    console.log('DELETE removing ID: ' + development._id);
  	                    res.format({
  	                        //HTML returns us back to the main page, or you can create a success page
  	                          html: function(){
  	                               res.redirect("/");
  	                         },
  	                         //JSON returns the item with the message that is has been deleted
  	                        json: function(){
  	                               res.json({message : 'deleted',
  	                                   item : development
  	                               });
  	                         }
  	                      });
  	                }
  	            });
  	        }
  	    });
  	});

function readJSONFile(filename, callback) {
  require("fs").readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}

module.exports = router;
