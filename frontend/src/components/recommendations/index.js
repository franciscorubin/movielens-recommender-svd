import React from 'react';
import { connect } from 'react-redux';
import Grid from './Grid';
import * as _ from 'ramda';
import { header } from '../../theme';

class Recommendations extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    if (this.props.isProcessing || !this.props.movies || this.props.movies.length <= 0) {
      return (
        <div style={styles.root}>
          <img style={styles.interwind} src="interwind.svg" />
        </div>
      )
    }
    return (
      <div style={{ paddingTop: header.height }}>
        <Grid movies={this.props.movies} />
      </div>
    );
  }
}

const styles = {
  interwind: {
    marginTop: `calc(50vh - ${header.height+100}px`
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  }
}

const mapStateToProps = ({ recommendations, movies, ratings }) => {
  return {
    movies: _.values(_.pick(recommendations.recommendations, movies.moviesInfo)),
    isProcessing: ratings.currentlyProcessing
  }
}

export default connect(mapStateToProps)(Recommendations);
