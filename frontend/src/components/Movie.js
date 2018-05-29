import React from 'react';
import { connect } from 'react-redux';
import { processRatings, rateMovie } from '../redux/ratings';
import './Movie.css';
import ReactStars from 'react-stars'
import { colors } from '../theme';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, WithStore } from 'pure-react-carousel';

class Movie extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageError: false
    }
  }

  ratingChanged = (newRating) => {
    this.props.rate(this.props.movie.id, newRating);
  }

  onImageError = () => {
    this.setState({
      imageError: true
    })
  }

  render() {
    if (this.state.imageError) {
      return null;
    }


    const content = (
      <div style={this.props.style}>
        <div className="container">
          <img onError={this.onImageError} className="image" src={this.props.movie.poster} />
          <div className="stars">
            <ReactStars
              count={5}
              onChange={this.ratingChanged}
              size={26}
              half={false}
              value={this.props.rating}
              color2={'#FEB90C'} 
            />
          </div>
          <div className="middle">
            <div style={styles.title}>{this.props.movie.title}</div>
          </div>
        </div>
      </div>
    );

    if (this.props.usesSlider) {
      return (
        <Slide index={this.props.i}>
          {content}
        </Slide>
      )
    } else {
      return content;
    }
  }
}

const styles = {
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: 'auto'
  },
  title: {
    color: colors.secondary,
    fontSize: '16px',
    padding: 8
  }
}

const mapStateToProps = ({ ratings }, ownProps) => {
  const id = ownProps.movie.id;
  
  return {
    rating: ratings.confirmed[id] || ratings.pending[id] || null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rate: (movieId, rating) => { dispatch(rateMovie(movieId, rating)); },
    confirmRatings: () => { dispatch(processRatings()); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
