const express = require('express');
const router = express.Router();
const Visitor = require('../models/visitor.model');
const mongoose = require('mongoose');
const dateFormat = require('dateformat');
const multer = require('multer');
let upload = multer();


router.get('/', (req, res, next) => { 
    Visitor.find()
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    
});

router.post('/', upload.array(), (req, res, next) => {
  
    const visitor = new Visitor({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        schedule: dateFormat(Date.parse(req.body.schedule), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        transactions: JSON.parse(req.body.transactions)
        
    });
    visitor.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            visitorInfo: visitor
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

    function createTransObj(tname) { 
        let obj = {
            name: tname,
            status: 'Pending'
        }
        return obj;
    }
});


router.get('/:visitorId', (req, res, next) => {
    const id = req.params.visitorId;
    Visitor.findById(id)
    .exec()
    .then(doc => {
        console.log('From the Database' +doc);
        if (doc) {
            res.status(200).json({doc})
        } else {
            res.status(404).json({message: "No Valid entry found..." })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.patch('/:visitorId', (req, res, next) => {
    const id = req.params.visitorId;
    const trans = req.params.trans;
    let str;

    if(trans == "drugs") {
        str = "Drug Clearance";
    }
    
    Visitor.update({ _id: id}, {$set: {status: req.body.newStatus}})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({message: result.n+ " record(s) modified."});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:visitorId', (req, res, next) => {
    const id = req.params.visitorId;
    Visitor.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({message: result.n+ " record(s) deleted."});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;