import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import RateSlider from './RateSlider';
import { connect } from 'react-redux';
import * as _ from 'ramda';
import { fetchPopularMovies, addSeen } from '../../redux/movies';


class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastSeenIndex: 0
    };
  }
  onClose = () => {
    const moviesSeen = _.slice(0, this.state.lastSeenIndex + 1, this.props.popularNotSeen);
    console.log('Movies Seen: ' + moviesSeen);
    this.props.addSeenMovies(moviesSeen);
    if (this.state.lastSeenIndex >= 10) {
      this.props.fetchMorePopular();
    }

    this.props.onDialogClose();
  }  

  render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Dialog
          maxWidth={false}
          fullScreen={fullScreen}
          open={this.props.open}
          onClose={this.props.onDialogClose}
        >
          <DialogTitle>{'Puntuar películas'}</DialogTitle>
          <DialogContent>
            <RateSlider movies={this.props.movies} setLastSeenIndex={(last) => { this.setState({ lastSeenIndex: last })}} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClose} color="primary" autoFocus>
              Salir
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ movies }) => {
  return {
    popularNotSeen: movies.popularNotSeen,
    movies: _.values(_.pick(movies.popularNotSeen, movies.moviesInfo))
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMorePopular: () => { dispatch(fetchPopularMovies())},
    addSeenMovies: (ids) => { dispatch(addSeen(ids))}
  }
};

export default withMobileDialog()(connect(mapStateToProps, mapDispatchToProps)(ResponsiveDialog));