import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

const links_file_path = path.join(__dirname, '../../../ai/data/movielens_full/links.csv');
let imdb_ids = null;
export const getImdbIds = function (req, res, next) {
  if (imdb_ids === null) {
    imdb_ids = [];
    csv().fromFile(links_file_path)
      .on('csv',(csvRow)=>{
        imdb_ids[csvRow[0]] = csvRow[1]
      })
      .on('done',(error)=>{
        if (error) throw error;
        req.imdb_ids = imdb_ids;
        next();
      });
  } else {
    req.imdb_ids = imdb_ids;
    next();
  }
}

const movie_info_small_file_path = path.join(__dirname, '../../../ai/checkpoint/dataset_info_small.json');
let movie_info_small = null;
export const getMovieInfoSmall = function (req, res, next) {
  if (movie_info_small === null) {
    console.log('Loading movie info.');
    fs.readFile(movie_info_small_file_path, 'utf8', function (err, data) {
      if (err) throw err;
      movie_info_small = JSON.parse(data);
      console.log('Movie info loaded.');
      req.movie_info_small = movie_info_small; 
      next();
    });
  } else {
    req.movie_info_small = movie_info_small;
    next()
  }
}