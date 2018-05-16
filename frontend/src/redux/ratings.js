import * as _ from 'ramda';
import { setRecommendations } from './recommendations';
import { addMoviesInfo } from './movies';
import { api } from '../config';

const actionDescriptor = {
  rateMovie: 'RATINGS/RATE',
  confirmRatings: 'RATINGS/CONFIRMRATINGS'
}


export const processRatings = () => {
  return (dispatch, getState) => {
    const ratings = getState().ratings;
    const confirmedRatings = ratings.confirmed;
    const pendingRatings = ratings.pending;

    fetch(`${api.server_address}api/getRecommendations`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ ratings: [...pendingRatings, ...confirmedRatings] })
      })
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => {
        const recommendations = jsonRes['recommendations'];
        const recommendationIds = _.keys(recommendations);

        console.log('Received new recommendations:');

        dispatch(addMoviesInfo(recommendations));
        dispatch(confirmRatings(pendingRatings));
        dispatch(setRecommendations(recommendationIds));
      })
      .catch((err) => {
        console.error('Error processing ratings and loading recommendations:');
        console.error(err);
      });
  }
}
export const rateMovie = (movieId, rating) => {
  return {
    type: actionDescriptor.rateMovie,
    data: {
      movieId,
      rating
    }
  }
}

export const confirmRatings = (movieIds) => {
  return {
    type: actionDescriptor.confirmRatings,
    data: movieIds
  }
}

const initialState = {
  confirmed: {},
  pending: {}
}

export function ratings(state = initialState, action) {
  switch (action.type) {
    case actionDescriptor.rateMovie:
      const newPending = { ...state.pending, [action.data.movieId]: action.data.rating }
      return { ...state, pending: newPending }
    case actionDescriptor.confirmRatings:
      const movieIds = action.data;
      const newPending2 = _.without(movieIds, state.pending);
      const movies = _.pick(movieIds, state.pending);
      const newConfirmed = { ...state.confirmed, ...movies }
      return { ...state, pending: newPending2, confirmed: newConfirmed }
    default:
      return state
  }
}