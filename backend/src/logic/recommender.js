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

  return _.take(array_with_index, n).map((obj) => { return obj[0] + 1; });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function get_popular_movies(movie_info, amount=50) {
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

export function recommend_svd(user_ratings, V, amount=50) {
  const V_ = math.matrix(V);
  const Vt = math.transpose(V_);

  const u_pred = math.matrix(fit_u(user_ratings, V_));

  const ratings_pred = math.multiply(u_pred, Vt);
  return get_best_recommendations(ratings_pred._data, amount);
}

const predict = (u, v) => {
  return math.dot(u, v);
}

const fit_u = (ratings, V, lr=0.03, min_improvement=0.001, init_value=0.1) => {
  const f = V.size()[1];
  const unew = (new Array(f)).fill(init_value);

  for (let k = 0; k < f; k++) {
    let prev_tot_loss = 999999999;
    let tot_loss = 99999;
    let comp = 0;
    while ((prev_tot_loss - tot_loss) >= min_improvement) {
      prev_tot_loss = tot_loss;
      comp = 0;
      tot_loss = 0;
      for (let movieId in ratings) {
        const rating = ratings[movieId];
        const v_ind = parseInt(movieId) - 1;

        const pred = predict(unew, V._data[v_ind])
        const loss = rating - pred;

        unew[k] += lr * loss * V._data[v_ind][k];

        tot_loss = loss**2;
        comp += 1;
      }

//      console.log(`Feature ${k}, Loss: ${tot_loss/comp}`);
    }
  }

  return unew;
}