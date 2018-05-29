import React, { Component } from 'react';
import Recommendations from './recommendations';
import RateButton from './rate/RateButton';
import { connect } from 'react-redux';
import { fetchPopularMovies } from "../redux/movies";
import { processRatings } from "../redux/ratings";
import Button from 'material-ui/Button';
import { header, colors } from '../theme';


class App extends Component {
  componentWillMount() {
    this.props.fetchMovies();
    this.props.processRatings();
  }

  refreshRecommendations = () => {
    this.props.processRatings();
  }

  render() {
    return (
      <div>
        <div style={styles.header}>
          <RateButton />
          <i style={styles.refreshIcon} onClick={this.refreshRecommendations} className="material-icons">refresh</i>
        </div>

        <Recommendations />
      </div>
    );
  }
}

const styles = {
  header: {
    height: header.height,
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    position: 'fixed',
    width: '100%',
    zIndex: 200
  },
  refreshIcon: {
    cursor: 'pointer',
    color: colors.secondary,
    fontSize: '34px'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMovies: () => { dispatch(fetchPopularMovies()); },
    processRatings: () => { dispatch(processRatings()); }
  }
}

export default connect(null, mapDispatchToProps)(App);
