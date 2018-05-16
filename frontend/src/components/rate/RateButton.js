import React, { Component } from 'react';
import Button from 'material-ui/Button';
import RateDialog from './RateDialog';

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
      <div>
        <Button color='primary' onClick={this.onOpenRate}>Rate</Button>
        <RateDialog open={this.state.rateOpen} onDialogClose={this.onCloseRate} />
      </div>
    );
  }
}

export default RateButton;
