//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Development = require('../model/db');
//var Development = mongoose.model('Development');
//var developments = require('../model/developments');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
let config = {
  headers: {'Accept':  'application/json'}
}
describe('BG Interactive desktop tests', () => {
    beforeEach((done) => { //Before each test we empty the database
        Development.remove({}, (err) => {
           done();
        });
    });
/*
  * Test the /GET route
  */
  describe('/GET Development', () => {
      it('it should GET all the developments', (done) => {
        chai.request(server)
            .get('/')
            .set( config.headers )
            .end((err, res) => {
              //console.log(err);
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/POST development', () => {
      it('it should not POST a developmnt without name field', (done) => {
        let development = {
          //development_name : 'London Dock',
          development_id : 1,
          description : 'London Dock development',
          imagepath : '',
          isactive: 1
        }
        chai.request(server)
            .post('/')
            .set( config.headers )
            .send(development)
            .end((err, res) => {
              //console.log(err);
              //console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('name');
                res.body.errors.name.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should POST a Development ', (done) => {
        let development = {
          development_name : 'London Dock',
          development_id : '1',
          description : 'London Dock development',
          imagepath : '',
          isactive: 1
        }
        chai.request(server)
            .post('/')
            .set( config.headers )
            .send(development)
            .end((err, res) => {
              //console.log(err);
              //console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Development successfully added!');
                res.body.development.should.have.property('name');
                res.body.development.should.have.property('developmentid');
                res.body.development.should.have.property('description');
                res.body.development.should.have.property('isactive');
              done();
            });
      });
  });
  /*
  * Test the /GET/:id route
  */
  describe('/GET/:id development', () => {
      it('it should GET a development by the given id', (done) => {
        let development = new Development ({
          name : 'London Dock',
          developmentid : '1',
          description : 'London Dock development',
          imagepath : '',
          isactive: 1
        });
        development.save((err, development) => {
            chai.request(server)
            .get('/' + development.id)
            .set( config.headers )
            .send(development)
            .end((err, res) => {
              //console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('developmentid');
                res.body.should.have.property('description');
                res.body.should.have.property('isactive');
                res.body.should.have.property('_id').eql(development.id);
              done();
            });
        });

      });
  });

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id development', () => {
      it('it should UPDATE a development given the id', (done) => {
        let development = new Development ({
          name : 'London Dock',
          developmentid : '1',
          description : 'London Dock development',
          imagepath : '',
          isactive: 1
        });
        let developmentUpdate = {
          development_name : 'Kidbrooks Info',
          development_id : '2',
          description : 'Kidbrooks Info',
          imagepath : '',
          isactive: 1
        };
        development.save((err, development) => {
                chai.request(server)
                .put('/' + development.id+'/edit')
                .set( config.headers )
                .send({development_name : 'Kidbrooks Info', development_id : '2', description : 'Kidbrooks Info', imagepath : '', isactive: 1 })
                .end((err, res) => {
                  //console.log(res.body);
                  //console.log(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Development successfully updated!');
                    res.body.development.should.have.property('developmentid').eql(2);
                  done();
                });
          });
      });
  });

});// end main describe which has before each 
