
import fs from 'fs';
import path from 'path';
 
const path_to_V = path.join(__dirname, '../../../ai/checkpoint/svd_V.json');
let V = null;
function loadV(cb) {
  console.log('Loading V now.');
  fs.readFile(path_to_V, 'utf8', function (err, data) {
    if (err) {
      console.warn(err);
      console.warn('Failed to load SVD Model V');
      cb(null);
      return;
    }
    V = JSON.parse(data);
    console.log('V loaded.');
    cb(V);
  });
}

export const getV = function (req, res, next) {
  if (V === null) {
    loadV((V) => {
      req.svd_V = V; 
      next();
    });
  } else {
    req.svd_V = V;
    next()
  }
}


const path_to_U = path.join(__dirname, '../../../ai/checkpoint/svd_U.json');
let U = null;
function loadU(cb) {
  console.log('Loading U now.');
  fs.readFile(path_to_U, 'utf8', function (err, data) {
    if (err) {
      console.warn(err);
      console.warn('Failed to load SVD Model U');
      cb(null);
      return;
    }
    U = JSON.parse(data);
    console.log('U loaded.');
    cb(U);
  });
}

export const getU = function (req, res, next) {
  if (U === null) {
    loadU((U) => {
      req.svd_U = U; 
      next();
    });
  } else {
    req.svd_U = U;
    next()
  }
}
