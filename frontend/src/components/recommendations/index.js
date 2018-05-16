import React from 'react';
import { connect } from 'react-redux';
import Grid from './Grid';
import * as _ from 'ramda';

class Recommendations extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <Grid movies={this.props.movies} />
      </div>
    );
  }
}

const mapStateToProps = ({ recommendations, movies }) => {
  return {
    movies: _.values(_.pick(recommendations.recommendations, movies.moviesInfo))
  }
}

export default connect(mapStateToProps)(Recommendations);
