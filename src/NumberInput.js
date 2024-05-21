import { TextField, Box } from "@mui/material";

function NumberInput(props) {
	return (
		<Box
			sx={{
				margin: "auto",
				display: "flex",
				flex: 1,
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: 2,
				borderRadius: 1,
			}}
		>
			<TextField
				label={props.label || ""}
				value={props.value}
				onChange={props.onChange}
				variant="outlined"
				fullWidth
				sx={{
					"& .MuiInputBase-root": {
						color: props.color || "text.primary",
						backgroundColor: "rgba(0.0, 0.0, 0.0, 0.1)",
						borderRadius: 1,
						height: "2.2em",
					},
					"& .MuiOutlinedInput-root": {
						"& fieldset": {
							// borderColor: "primary.main",
						},
						"&:hover fieldset": {
							borderColor: "primary.dark",
						},
						"&.Mui-focused fieldset": {
							// borderColor: "primary.light",
						},
						"& .MuiInputBase-input": {
							fontWeight: "300",
							fontSize: "2em",
							textAlign: "right",
						},
					},
					marginBottom: 2,
				}}
			/>
		</Box>
	);
}

export default NumberInput;
