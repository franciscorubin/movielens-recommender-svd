import React from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Image, WithStore } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';


const VISIBLE_SLIDES = 5;
class AmountSeenCounter extends React.Component {
  componentDidUpdate() {
    const currentSlide = this.props.currentSlide;
    this.props.onMoveSlide(currentSlide);
  }

  render() {
    return null;
  }
}
const AmountSeenCounterWithStore = WithStore(AmountSeenCounter, state => ({
  currentSlide: state.currentSlide
}));

class RateSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      biggestSlideSeen: 0
    }
  }

  movedSlide = (currentSlide) => {
    if (currentSlide > this.state.biggestSlideSeen) {
      this.setState({
        biggestSlideSeen: currentSlide
      });
      this.props.setLastSeenIndex(currentSlide + VISIBLE_SLIDES);
    }
  }

  render() {
    return (
      <CarouselProvider
        style={styles.carouselParent}
        naturalSlideWidth={300}
        naturalSlideHeight={429}
        totalSlides={this.props.movies.length}
        visibleSlides={VISIBLE_SLIDES}
        step={5}
        touchEnabled={false}
        dragEnabled={false}
        currentSlide={this.state.biggestSlideSeen}
      >
        <AmountSeenCounterWithStore onMoveSlide={this.movedSlide}/>
        <div style={styles.sliderContainer}>
          <Slider style={styles.slider}>
            {this.props.movies.map((movie, i) => {
              return (
                <Slide key={movie.id} index={i}>
                  <Image src={movie.poster} />
                </Slide>
              )
            })}
          </Slider>
          <ButtonNext style={styles.buttonNext}><i style={styles.buttonNextIcon} className="material-icons">arrow_right</i></ButtonNext>
        </div>
      </CarouselProvider>
    );
  }
}

const styles = {
  carouselParent: {
    width: '70vw'
  },
  sliderContainer: {
    display: 'flex'
  },
  slider: {
    flex: 1
  },
  buttonNext: {
    margin: 'auto auto',
  },
  buttonNextIcon: {
    fontSize: '48px'
  }
}

export default RateSlider;
