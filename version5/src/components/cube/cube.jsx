import React from 'react';

class Cube extends React.Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div>
				<div className="scene">
					<div className="cube">
						<div className="cube__face cube__face--front">front</div>
						<div className="cube__face cube__face--back">back</div>
						<div className="cube__face cube__face--right">right</div>
						<div className="cube__face cube__face--left">left</div>
						<div className="cube__face cube__face--top">top</div>
						<div className="cube__face cube__face--bottom">bottom</div>
					</div>
				</div> 
			</div>

		)
	}
}
export default Cube;