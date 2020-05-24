// Create loading animation

import React, { Component } from "react";
import "./style.css";

// Set rate of animation
const TICK_RATE = 500;

class Loading extends Component {
  state = {
    dots: 0,
  };

  // Start interval once component has finished mounting
  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);
  }

  // Stop interval once component ends
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Update state of dot with each iteration
  onTick = () => {
    this.setState((prevState) => ({ dots: (prevState.dots + 1) % 4 }));
  };

  render() {
    const { isCenter } = this.props;
    const { dots } = this.state;

    const classNames = ["Loading"];

    if (isCenter) {
      classNames.push("Loading_center");
    }

    return (
      <div className={classNames.join(" ")}>
        <small>Loading {new Array(dots).fill(0).map((dot) => ".")}</small>
      </div>
    );
  }
}

export default Loading;
