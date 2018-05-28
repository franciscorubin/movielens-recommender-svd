import React from 'react';
import { connect } from 'react-redux';
import { processRatings, rateMovie } from '../redux/ratings';

class Movie extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return null;
  }
}

const mapStateToProps = ({ ratings }) => {
  return {
    // ratings: {movieId: ratings, ...}
    ratings: { ...ratings.confirmed, ...ratings.pending }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rate: (movieId, rating) => { dispatch(rateMovie(movieId, rating)); },
    confirmRatings: () => { dispatch(processRatings()); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
