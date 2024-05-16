// MatchupContainerView.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";
import useDimensions from "./hooks/useDimensions";

import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import QuizModeSlider from "./QuizModeSlider";

import "./MatchupContainer.css";

const MatchupContainerView = () => {
  const dispatch = useDispatch();
  const dimensions = useDimensions();
  const { matchup, quizMode, winsDisplay } = useSelector((state) => state);
  const { videogameId, left, right } = matchup;

  // useEffect(() => {
  //   if (quizMode) {
  //     setWinsDisplay([50, 50]);
  //   } else {
  //     setWinsDisplay([
  //       wins[videogameId][left][right],
  //       wins[videogameId][right][left],
  //     ]);
  //   }
  // }, [videogameId, left, right, quizMode]);

  // if (dimensions.width < 800) {
  //   return (
  //     <div className="matchup-container">
  //       <div className="top-row">
  //         <LabeledCharacterPortrait side="left" />
  //         <LabeledCharacterPortrait side="right" />
  //       </div>
  //       <MatchupSlider
  //         winsL={wins[videogameId][left][right]}
  //         winsR={wins[videogameId][right][left]}
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait side="left" />
        <div className="matchup-container-center">
          <MatchupRecordDisplay
            leftWins={winsDisplay[0]}
            rightWins={winsDisplay[1]}
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
                        value: winsDisplay[1],
                        label: right,
                        color: "#cc76a1",
                      },
                      {
                        id: 1,
                        value: winsDisplay[0],
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
        <LabeledCharacterPortrait side="right" />
      </div>
      <div class="bottom-row">
        <button
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "first" });
          }}
        >
          First
        </button>
        <button
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "prev" });
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "random" });
          }}
        >
          New
        </button>
        <button
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "next" });
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            console.log("clicked");
            dispatch({ type: "last" });
          }}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default MatchupContainerView;
