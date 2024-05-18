// MatchupContainer.js
import { useState, React }from "react";
import { useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";

import LabeledCharacterPortrait from "./CharacterPortrait";
import { MatchupNavigator } from "./MatchupNavigator.js";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import QuizModeSlider from "./QuizModeSlider";

import "./MatchupContainer.css";


const MatchupContainer = () => {
  const { matchup, quizMode, winsDisplay } = useSelector((state) => state);
  let { left, right } = matchup;
  
  console.log('in matchupcontainer');
  
  const [winnerOnLeft, setWinnerOnLeft] = useState(false);
  const [lockLeftCharacter, setLockLeftCharacter] = useState(false);
  

  return (
	<div className="matchup-container">
		<div className="top-row">
			<LabeledCharacterPortrait side={winnerOnLeft?"left":"right"} />
			<div className="matchup-container-center">
				<MatchupRecordDisplay
					leftWins={winsDisplay[winnerOnLeft?0:1]}
					rightWins={winsDisplay[winnerOnLeft?1:0]}
				/>
				<div className="matchup-graphs">
					<div className="pie-chart-container">
						<PieChart
							slotProps={{ legend: { hidden: true } }}
							series={[
							{
								data: [
								{
									id: 0,
									value: winsDisplay[winnerOnLeft?1:0],
									label: right,
									color: "#cc76a1",
								},

								{
									id: 1,
									value: winsDisplay[winnerOnLeft?0:1],
									label: left,
									color: "#87b38d",
								},
								],
							},
							]}
							width={200}
							height={200}
						/>
					</div>
				{quizMode && <QuizModeSlider winsDisplay={winsDisplay} />}
				</div>
			</div>
			<LabeledCharacterPortrait side={winnerOnLeft?"right":"left"} />
		</div>
		<div class="bottom-row">
			<MatchupNavigator />
		</div>
	</div>
  );
};

export default MatchupContainer;
