import * as _ from 'ramda';
import { api } from '../config';

const actionDescriptor = {
  addSeen: 'MOVIES/ADD_SEEN',
  addPopular: 'MOVIES/ADD_POPULAR',
  addMoviesInfo: 'MOVIES/ADD_INFO'
}

export const fetchPopularMovies = () => {
  return (dispatch, getState) => {
    const seenMovies = getState().movies.seen;

    fetch(`${api.server_address}api/getPopularMovies`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ except: seenMovies })
      })
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => {
        const popularMovies = jsonRes['popularMovies'];

        console.log('Received new popular movies:');

        dispatch(addPopular(popularMovies));
      })
      .catch((err) => {
        console.error('Error getting popular movies.');
        console.error(err);
      });
  }
}

export const addSeen = (movieIds) => {
  return {
    type: actionDescriptor.addSeen,
    data: movieIds
  }
}

export const addPopular = (movies) => {
  return {
    type: actionDescriptor.addPopular,
    data: movies
  }
}

export const addMoviesInfo = (movies) => {
  return {
    type: actionDescriptor.addMoviesInfo,
    data: movies
  }
}

const initialState = {
  moviesInfo: {},
  seen: [],
  popularNotSeen: []
}

export function movies(state = initialState, action) {
  switch (action.type) {
    case actionDescriptor.addSeen:
      const newSeen = _.uniq([...state.seen, action.data]);
      const newPopularNotSeen = _.without(action.data, state.popularNotSeen);
      return { ...state, popularNotSeen: newPopularNotSeen, seen: newSeen }
    case actionDescriptor.addPopular:
      const movies = action.data;
      const newMoviesInfo = { ...state.moviesInfo, ...movies }
      const newPopularNotSeen2 = [...state.popularNotSeen, ..._.without(state.seen, _.keys(movies))];
      return { ...state, popularNotSeen: newPopularNotSeen2, moviesInfo: newMoviesInfo }
    case actionDescriptor.addMoviesInfo:
      const newMoviesInfo2 = { ...state.moviesInfo, ...action.data };
      return { ...state, moviesInfo: newMoviesInfo2 }
    default:
      return state
  }
}