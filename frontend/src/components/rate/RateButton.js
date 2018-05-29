import React, { Component } from 'react';
import Button from 'material-ui/Button';
import RateDialog from './RateDialog';
import {colors} from '../../theme';

class RateButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rateOpen: false
    }
  }

  onOpenRate = () => {
    this.setState({
      rateOpen: true
    });
  }

  onCloseRate = () => {
    this.setState({
      rateOpen: false
    });
  }
  render() {
    return (
      <div style={{ cursor: 'pointer' }}>
        <div style={styles.button} onClick={this.onOpenRate}>
          <i style={styles.icon} className="material-icons">star_rate</i>
          <div style={styles.rateText}>Puntuar películas populares</div>
        </div>
        <RateDialog open={this.state.rateOpen} onDialogClose={this.onCloseRate} />
      </div>
    );
  }
}

const styles = {
  button: {
    backgroundColor: 'inherit',
    color: colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: 'none'
  },
  icon: {
    width: 34,
    fontSize: '34px'
  },
  rateText: {
    fontSize: '24px',
    marginLeft: 4
  }
}

export default RateButton;
