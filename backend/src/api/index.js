
import express from 'express';
import { getModel } from '../middleware/svd';
import { getImdbIds, getMovieInfoSmall } from '../middleware/movies';
import _ from 'lodash';

import { recommend_svd, get_popular_movies } from '../logic/recommender';
import { get_movies_data } from '../logic/imdb';

const api = express.Router();

api.post('/getRecommendations', getModel, getImdbIds, getMovieInfoSmall, function (req, res) {
  const user_ratings = req.body.ratings;
  const svd_model = req.svd_model;
  const imdb_ids = req.imdb_ids;
  const movie_info = req.movie_info_small

  let recommendation_movie_ids;
  if (!svd_model || !user_ratings || _.keys(user_ratings).length < 10) {
    recommendation_movie_ids = get_popular_movies(movie_info);
  } else {
    recommendation_movie_ids = recommend_svd(user_ratings, svd_model);
  }

  const recommendation_imdb_ids = recommendation_movie_ids.map((id) => { return imdb_ids[id]; })

  get_movies_data(recommendation_imdb_ids).then((movies) => {
    const recommendations = {};
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const imdbId = recommendation_imdb_ids[i];
      const movieId = recommendation_movie_ids[i];
      if (movie) {
        recommendations[movieId] = { ...movie, imdbId }
      }
    }


    res.json({ recommendations });
  });
});

// gets body arg: except [movieId, movieId2, ...] of movies that cant be returned
// return popularMovies { movieId: movieInfo, movieId2: movieInfo2, ...}
api.post('/getPopularMovies', getImdbIds, getMovieInfoSmall, function (req, res) {
  const except = req.body.except;
  const imdb_ids = req.imdb_ids;
  const movie_info = req.movie_info_small

  const recommendation_movie_ids = get_popular_movies(movie_info);

  const recommendation_imdb_ids = recommendation_movie_ids.map((id) => { return imdb_ids[id]; })

  get_movies_data(recommendation_imdb_ids).then((movies) => {
    const popularMovies = {};
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const imdbId = recommendation_imdb_ids[i];
      const movieId = recommendation_movie_ids[i];
      if (movie) {
        popularMovies[movieId] = { ...movie, imdbId }
      }
    }


    res.json({ popularMovies });
  });
});

export default api;