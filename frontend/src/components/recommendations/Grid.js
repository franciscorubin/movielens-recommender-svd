import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
import IconButton from 'material-ui/IconButton';
import { header } from '../../theme';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100vw',
    height: `calc(100vh - ${header.height}px)`,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  gridBox: {
    width: 182
  }
});

function Grid(props) {
  const { classes, movies } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={268} className={classes.gridList} cols={5}>
        {movies.map(movie => (
          <GridListTile key={movie.poster} style={classes.gridBox}>
            <img src={movie.poster} alt={movie.title} />
            <GridListTileBar
              title={movie.title}
              subtitle={<span>by: {movie.director}</span>}
              actionIcon={
                <IconButton className={classes.icon}>
                  <p>Star</p>
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Grid);