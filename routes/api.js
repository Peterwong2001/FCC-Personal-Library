/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

module.exports = function (app) {

  let uri = process.env.MONGO_URI;
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String]
  })

  let Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      let arrayOfBooks = [];
      Book.find({}, function (err, data) {
        if(!err && data) {
          data.forEach(function(result) {
            let book = result.toJSON();
            book['commentcount'] = book.comments.length;
            arrayOfBooks.push(book);
          })
          return res.json(arrayOfBooks);
        }
      })
      
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        return res.json('missing required field title');
      }

      let newBook = new Book({
        title: title,
        comments: []
      });

      newBook.save(function(err, data) {
        if(!err && data) {
          return res.json(data);
        }
      })
      
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany({}, function(err, data) {
        if(!err && data) {
          return res.send('complete delete successful');
        }
      })
      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, function(err, data) {
        if(!err && data) {
          return res.json(data);
        } else {
          return res.json('no book exists');
        }
      })

      
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!bookid) {
        return res.json('no book exists');
      }

      if(!comment) {
        return res.json('missing required field comment');
      }

      Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true }, function(err, data) {
        if(!err && data) {
          return res.json(data);
        } else {
          return res.json('no book exists')
        }
      })

      
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid, function(err, data) {
        if(!err && data) {
          return res.send('delete successful');
        } else {
          return res.send('no book exists');
        }
      })
      
    });
  
};
