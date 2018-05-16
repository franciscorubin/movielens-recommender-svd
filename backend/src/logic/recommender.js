import math from 'mathjs';
import _ from 'lodash';

function get_best_recommendations(y, n) {
  let array_with_index = y.map((v, i) => {
    return [i, v];
  })

  array_with_index.sort((a, b) => {
    if (a[1] > b[1]) {
      return -1;
    } else if (a[1] == b[1]) {
      return 0;
    } else {
      return 1;
    }
  });

  return _.take(array_with_index, n).map((obj) => { return obj[0]; });
}

export function recommend_svd(user_ratings, model, amount = 30) {
  // TODO transformar user_ratings {movieId: rating, ...} en X_user [rat, rat, rat, rat ...]
  throw new Error('See TODO ^');
  const S = math.matrix(model['S']);
  const Vt = math.matrix(model['Vt']);

  const U_new = math.dot(math.dot(X_user, math.transpose(Vt)), math.inv(S))
  const y_new = math.dot(math.dot(U_new, S), Vt);

  return get_best_recommendations(y_new, amount);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function get_popular_movies(movie_info, amount=30) {
  // show random movies that are among the 1000 with highest rating count
  const count_ratings = movie_info['count_ratings'];

  const min = 0;
  const max = count_ratings.length < 1000 ? count_ratings.length : 1000;
  let res = [];
  while (res.length < amount) {
    res.push(getRandomInt(min, max));
  }
  return res;
}
