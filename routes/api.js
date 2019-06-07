'use strict'

var expect = require('chai').expect
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const MONGODB_CONNECTION_STRING = process.env.DB

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
            res.send(arr)
          })
          .catch(err => res.send(err))
      })
    })
    
    .post(function (req, res){
      var title = req.body.title
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
          res.send(doc.ops[0])
          return
        })
        .catch(err => res.send(err))
      })
    })
    
    .delete(function(req, res){
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .deleteMany({})
        .then(data => {
          res.json({message: 'Complete delete successful'})
        })
        .catch(err => res.send(err))
      
      })
    })



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .findOne({_id: new ObjectId(bookid)}, {projection: {commentcount: 0}})
        .then(doc => {
          if(!doc)
            res.json({message: 'no book exists'})
          else
            res.json(doc)
        })
        .catch(err => console.error(err))
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id
      var comment = req.body.comment
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .findOneAndUpdate({_id: new ObjectId(bookid)}, {$push: {comments: comment}, $inc: {commentcount: 1}}, {returnOriginal: false})
        .then(doc => {
          res.json(doc.value)
        })
        .catch(err => console.error(err))
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id
      MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        db.db().collection('books')
        .deleteOne({_id: new ObjectId(bookid)})
        .then(doc => {
          res.json({message: 'Delete successful'})
        })
        .catch(err => console.error(err))
      })
    })
  
}
