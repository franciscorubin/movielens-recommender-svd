
import fs from 'fs';
import path from 'path';

const path_to_model = path.join(__dirname, '../../../ai/checkpoint/svd_full.json');

let model = null;

function loadModel(cb) {
  console.log('Loading model now.');
  fs.readFile(path_to_model, 'utf8', function (err, data) {
    if (err) {
      console.warn('Failed to load SVD Model');
      cb(null);
      return;
    }
    model = JSON.parse(data);
    console.log('Model loaded.');
    cb(model);
  });
}

export const getModel = function (req, res, next) {
  if (model === null) {
    loadModel((model) => {
      req.svd_model = model; 
      next();
    });
  } else {
    req.svd_model = model;
    next()
  }
}