import React from 'react';
import { useDispatch } from 'react-redux';
import "./NavigationOverlay.css";

const NavigationOverlay = ({children}) => {
	console.log(children);
	console.log(children.props.side);
	console.log(children.props.newRandomMatchup);
	const dispatch = useDispatch();
	return(
		<div className="container">
			<div className="box">
				{children}
			</div>
			<div className="overlay">
				<button onClick={() => {console.log('clicked');dispatch({ type: "random", side:children.props.side });}}>New</button>
		  </div>
		</div>

	);
};

export default NavigationOverlay;