export default function (classes, predictions) {
	const predictionClasses = predictions.map(p => p.class);

	return classes.every(c => predictionClasses.includes(c));
}
