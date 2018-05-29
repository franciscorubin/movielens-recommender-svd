import React from 'react';
import PropTypes from 'prop-types';
import { header } from '../../theme';
import Movie from '../Movie';

function Grid(props) {
  const { classes, movies } = props;
  return (
    <div style={styles.root}>
      <div style={styles.grid}>
        {movies.map(movie => (
          <div key={movie.id} style={styles.gridBox}>
            <Movie movie={movie} style={styles.movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
  },
  grid: {
    width: '80vw',
    minHeight: `calc(100vh - ${header.height}px)`,
    display: 'flex',
    flexWrap: 'wrap'
  },
  gridBox: {
    margin: 'auto auto'
  },
  movie: {
    width: 182,
    height: 272,
    margin: 4
  }
}


export default Grid;