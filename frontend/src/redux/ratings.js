import * as _ from 'ramda';
import { setRecommendations } from './recommendations';
import { addMoviesInfo } from './movies';
import { api } from '../config';

const actionDescriptor = {
  rateMovie: 'RATINGS/RATE',
  confirmRatings: 'RATINGS/CONFIRMRATINGS',
  setProcessing: 'RATINGS/SETPROCESSING'
}


export const processRatings = () => {
  return (dispatch, getState) => {
    console.log('Processing ratings.')
    dispatch(setProcessing(true));
    const ratings = getState().ratings;
    const confirmedRatings = ratings.confirmed;
    const pendingRatings = ratings.pending;
    const data = JSON.stringify({ ratings: {...pendingRatings, ...confirmedRatings} });
    fetch(`${api.server_address}api/getRecommendations`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: data
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
        dispatch(setProcessing(false));
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

const setProcessing = (bool) => {
  return {
    type: actionDescriptor.setProcessing,
    data: bool
  }
}

const initialState = {
  confirmed: {},
  pending: {},
  currentlyProcessing: false
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
    case actionDescriptor.setProcessing:
      return { ...state, currentlyProcessing: action.data }
    default:
      return state
  }
}