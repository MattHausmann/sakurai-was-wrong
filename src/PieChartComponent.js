import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";

import wins from "./wins.json";

const PieChartComponent = ({ pieChartDisplay }) => {
	const { displayQuizResults, matchup } = useSelector((state) => state);

	const [data, setData] = useState([
		{
			id: 0,
			value: pieChartDisplay[1],
			label: matchup.right,
			color: "#cc76a1",
		},

		{
			id: 1,
			value: pieChartDisplay[0],
			label: matchup.left,
			color: "#87b38d",
		},
	]);

	useEffect(() => {
		if (displayQuizResults) {
			let diff =
				wins[matchup.videogameId][matchup.left][matchup.right] -
				pieChartDisplay[0];

			let color;
			let [left, right] = pieChartDisplay;
			if (diff >= 0) {
				right = pieChartDisplay[1] - diff;
				color = "green";
			} else {
				diff = -diff;
				left = pieChartDisplay[0] - diff;
				color = "purple";
			}

			setData([
				{
					id: 0,
					value: right,
					label: matchup.right,
					color: "#cc76a1",
				},
				{ id: 2, value: diff, color, label: "Difference" },

				{
					id: 1,
					value: left,
					label: matchup.left,
					color: "#87b38d",
				},
			]);
		} else {
			setData([
				{
					id: 0,
					value: pieChartDisplay[1],
					label: matchup.right,
					color: "#cc76a1",
				},

				{
					id: 1,
					value: pieChartDisplay[0],
					label: matchup.left,
					color: "#87b38d",
				},
			]);
		}
	}, [displayQuizResults, matchup, pieChartDisplay]);

	return (
		<div className="pie-chart-container">
			<PieChart
				slotProps={{ legend: { hidden: !displayQuizResults } }}
				series={[
					{
						data,
						cx: displayQuizResults ? 0 : 100,
					},
				]}
				width={200}
				height={200}
			/>
		</div>
	);
};

export default PieChartComponent;
