import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";

import wins from "./wins.json";

const PieChartComponent = () => {
	const dispatch = useDispatch();
	const { displayQuizResults, matchup, quizMode, winsDisplay, lockLeft } =
		useSelector((state) => state);

	const [data, setData] = useState([
		{
			id: 0,
			value: winsDisplay[1],
			label: matchup.right,
			color: "#cc76a1",
		},

		{
			id: 1,
			value: winsDisplay[0],
			label: matchup.left,
			color: "#87b38d",
		},
	]);

	useEffect(() => {
		if (displayQuizResults) {
			let diff =
				wins[matchup.videogameId][matchup.left][matchup.right] - winsDisplay[0];

			let color;
			let [left, right] = winsDisplay;
			if (diff >= 0) {
				right = winsDisplay[1] - diff;
				color = "green";
			} else {
				diff = -diff;
				left = winsDisplay[0] - diff;
				color = "purple";
			}

			setData([
				{
					id: 0,
					value: right,
					label: matchup.right,
					color: "#cc76a1",
				},
				{ id: 2, value: diff, color },

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
					value: winsDisplay[1],
					label: matchup.right,
					color: "#cc76a1",
				},

				{
					id: 1,
					value: winsDisplay[0],
					label: matchup.left,
					color: "#87b38d",
				},
			]);
		}
	}, [displayQuizResults, matchup, winsDisplay]);

	return (
		<div className="pie-chart-container">
			<PieChart
				slotProps={{ legend: { hidden: true } }}
				series={[
					{
						data,
					},
				]}
				width={200}
				height={200}
			/>
		</div>
	);
};

export default PieChartComponent;
