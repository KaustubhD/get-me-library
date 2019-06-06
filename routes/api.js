/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        if(err)
          console.error(err)
        else
        db.db().collection('books')
          .find({})
          .project({comments: 0})
          .toArray()
          .then(arr => {
            // console.log(arr)
            res.send(arr)
          })
          .catch(err => console.error(err))
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(!title){
        res.status(400).json({err: 'No title provided'})
        return
      }
      let obj = {
        title,
        commentcount: 0,
        comments: []
      }
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .insertOne(obj)
        .then(doc => {
          // console.log('Inserted')
          // console.log(doc)
          // obj._id = doc.insertedId
          res.send(doc.ops[0])
          return
        })
        .catch(err => console.log(err))
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .deleteMany({})
        .then(data => {
          // console.log('Complete delete successful')
          // console.log(data)
          res.json({message: 'Complete delete successful'})
        })
        .catch(err => console.error(err))
      
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .findOne({_id: new ObjectId(bookid)}, {projection: {commentcount: 0}})
        .then(doc => {
          // console.log('Doc is ', doc)
          if(!doc)
            res.json({message: 'no book exists'})
          else
            res.json(doc)
        })
        .catch(err => console.error(err))
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      // console.log('id is >> ', bookid, ' And comment is >>', comment)
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .findOneAndUpdate({_id: new ObjectId(bookid)}, {$push: {comments: comment}}, {returnOriginal: false})
        .then(doc => {
          // console.log('Doc is updated', doc)
          
          res.json(doc.value)
        })
        .catch(err => console.error(err))
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .deleteOne({_id: new ObjectId(bookid)})
        .then(doc => {
          // console.log('Delete successful')
          // console.log('Deleted doc is', doc)
          
          res.json({message: 'Delete successful'})
        })
        .catch(err => console.error(err))
      })
      //if successful response will be 'delete successful'
    });
  
};
