#include "ofApp.h"

void ofApp::setup(){

	imgBg.loadImage("bg.jpg");
	imgRunning.loadImage("running.jpg");
	matBg = toCv(imgBg);
	matRunning = toCv(imgRunning);
}

void ofApp::draw(){

	for (int r = 0; r < matRunning.rows; r++){
		for (int c = 0; c < matRunning.cols; c++){
			bool isBg = 
				matRunning.at<Vec3b>(r, c)[0] <= 128 &&
				matRunning.at<Vec3b>(r, c)[1] >= 100 &&
				matRunning.at<Vec3b>(r, c)[2] <= 128;
			if (!isBg) {
				matBg.at<Vec3b>(r, c) = matRunning.at<Vec3b>(r, c);
			}
		}
	}
	drawMat(matBg, 0, 0);
}
