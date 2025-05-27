var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var items = require('../init_data.json').data;
var curId = _.size(items);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../static/img'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});


router.get('/', function(req, res) {
    res.json(_.toArray(items));
});


router.post('/', upload.single('image'), function(req, res) {
    try {
        var item = req.body;
        curId += 1;
        item.id = curId;
        
     
        if (req.file) {
            item.img = '/img/' + req.file.filename;
        }
        
        items[item.id] = item;
        log.info('Created item', item);
        res.json(item);
    } catch (error) {
        log.error('Error creating item:', error);
        res.status(400).json({ error: error.message });
    }
});


router.get('/:id', function(req, res, next) {
    var item = items[req.params.id];
    if (!item) {
        return next();
    }
    res.json(items[req.params.id]);
});


router.delete('/:id', function(req, res) {
    var item = items[req.params.id];
    if (item) {
        if (item.img) {
            const imagePath = path.join(__dirname, '../static', item.img);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    log.error('Error deleting image file:', err);
                } else {
                    log.info('Deleted image file:', imagePath);
                }
            });
        }
        delete items[req.params.id];
        log.info('Deleted item', item);
        res.status(204).json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});


router.put('/:id', function(req, res, next) {
    var item = req.body;
    if (item.id != req.params.id) {
        return next(new Error('ID paramter does not match body'));
    }
    items[item.id] = item;
    log.info('Updating item', item);
    res.json(item);
});


module.exports = router;
