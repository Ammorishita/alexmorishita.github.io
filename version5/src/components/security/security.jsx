import React from "react";

class Security extends React.Component {
  constructor(props) {
    super();
    this.secure = this.secure.bind(this);
		this.stop = this.stop.bind(this);
    this.state = {
			active: true
    };
  }
  updateState() {
		this.setState({
			active: !this.state.active
    });
  }
  secure(e) {
		const target = e.currentTarget;
		let counter = 0;
    this.timer = setInterval(() => {
			counter += 1;
      const border = document.querySelector(`.security__path--${counter}`);
      border.classList.add("security__path--active");
      if (counter >= 8) {
				clearInterval(this.timer);
				target.classList.add('security__button--unlocked');
      }
    }, 250);
  }
  stop() {
		const borders = document.querySelectorAll('.security__path');
		for(let i=0;i<borders.length;i++) {
			borders[i].classList.remove('security__path--active');
		}
    clearInterval(this.timer);
  }
  render() {
    return (
      <div className="security">
        <button
          type="button"
          className="security__button"
          onMouseDown={this.secure}
          onMouseUp={this.stop}
        >
          {/* <span className="security__text">Enter</span> */}
          <svg className={`icon-svg security__icon`}>
            <use xlinkHref={`#icon-lock`}></use>
          </svg>
          <svg className={`icon-svg security__icon-thumb`}>
            <use xlinkHref={`#icon-fingerprint`}></use>
          </svg>
        </button>
      </div>
    );
  }
}
export default Security;
