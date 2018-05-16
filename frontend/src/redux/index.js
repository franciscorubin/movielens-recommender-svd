import { combineReducers } from 'redux'
import { ratings } from './ratings';
import { movies } from './movies';
import { recommendations } from './recommendations';

const reducers = combineReducers({
  ratings,
  movies,
  recommendations
});

export default reducers