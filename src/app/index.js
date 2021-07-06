import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

import hasClasses from '../utils/has-classes';
import CLASSES from '../constants/classes';

const video = document.getElementById('webcam');
const preloadSection = document.getElementById('preload-section');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');
const loadingIndicator = document.getElementById('loading-indicator');
const personProgress = document.getElementById('person-progress');
const catAndPersonProgress = document.getElementById('cat-and-person-progress');

const INVISIBLE_CLASS = 'invisible';

let model;

function predictWebcam() {
	model.detect(video).then(predictions => {
		for (let n = 0; n < predictions.length; n++) {
			if (predictions[n].class === CLASSES.PERSON) {
				personProgress.setAttribute('value', predictions[n].score);
				catAndPersonProgress.setAttribute('value', 0);
			} else if (hasClasses([CLASSES.PERSON, CLASSES.CAT], predictions)) {
				const {score} = predictions.find(p => p.class === CLASSES.CAT);

				catAndPersonProgress.setAttribute('value', score);
				personProgress.setAttribute('value', 0);
			} else {
				personProgress.setAttribute('value', 0);
				catAndPersonProgress.setAttribute('value', 0);
			}
		}

		window.requestAnimationFrame(predictWebcam);
	});
}

cocoSsd.load().then(loadedModel => {
	model = loadedModel;
	loadingIndicator.classList.add('hidden');
	enableWebcamButton.disabled = false;
});

function enableCam() {
	if (!model) {
		return;
	}

	preloadSection.classList.add(INVISIBLE_CLASS);
	demosSection.classList.remove(INVISIBLE_CLASS);

	const constraints = {
		video: true
	};

	navigator.mediaDevices.getUserMedia(constraints).then(stream => {
		video.srcObject = stream;
		video.addEventListener('loadeddata', predictWebcam);
	});
}

function getUserMediaSupported() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (getUserMediaSupported()) {
	enableWebcamButton.addEventListener('click', enableCam);
} else {
	console.warn('getUserMedia() is not supported by your browser');
}
