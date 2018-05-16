import React, { Component } from 'react';
import Recommendations from './recommendations';
import RateButton from './rate/RateButton';
import { connect } from 'react-redux';
import { fetchPopularMovies } from "../redux/movies";
import { processRatings } from "../redux/ratings";
import { header } from '../theme';

class App extends Component {
  componentWillMount() {
    this.props.processRatings();
    this.props.fetchMovies();
  }
  render() {
    return (
      <div>
        <div style={styles.header}>
          <RateButton />
        </div>

        <Recommendations />
      </div>
    );
  }
}

const styles = {
  header: {
    height: header.height,
    backgroundColor: 'blue'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMovies: () => { dispatch(fetchPopularMovies()); },
    processRatings: () => { dispatch(processRatings()); }
  }
}

export default connect(null, mapDispatchToProps)(App);
