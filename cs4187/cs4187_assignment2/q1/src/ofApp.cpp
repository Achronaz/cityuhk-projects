#include "ofApp.h"

void ofApp::setup(){

	gui.setup();
	gui.add(lowThreshold.setup("low threshold", 50, 0, 100));
	gui.add(lineVoteThreshold.setup("line vote threshold", 150, 0, 200));

	video.loadMovie("solidWhiteRight.mp4");
	video.play();
}

void ofApp::update(){
	video.update();
    img.setFromPixels(video.getPixels());
}

void ofApp::draw(){
    ofBackground(255);
	ofSetColor(255,255,255);
    img.draw(0,0);

	imgMat = toCv(img);
    cvtColor(imgMat, imgMat, CV_BGR2GRAY);
    mask = Mat::zeros(cv::Size(img.getWidth(), img.getHeight()), CV_8U);

    for (int i = 0; i < keyPoints.size(); i++) {
        ofSetColor(255, 0, 0);
        ofDrawCircle(keyPoints[i].x, keyPoints[i].y, 5);
    }

    if (keyPoints.size() >= 3) {
        fillConvexPoly(mask, keyPoints.data(), keyPoints.size(), Scalar(255, 255, 255));
        bitwise_and(imgMat, mask, imgMat);
    }

    ofSetColor(255, 255, 255);

    GaussianBlur(imgMat, imgMat, 3);
    Canny(imgMat, imgMat, lowThreshold, lowThreshold * 2);
    drawMat(imgMat, img.getWidth(), 0);

    vector<Vec4i> lines;
    HoughLinesP(imgMat, lines, 2, CV_PI / 180, lineVoteThreshold, 15, 20);
    ofSetColor(255, 0, 0);
    for (int i = 0; i < lines.size(); i++) {
        float x1 = lines[i][0];
        float y1 = lines[i][1];
        float x2 = lines[i][2];
        float y2 = lines[i][3];
        ofPolyline l;
        l.addVertex(x1, y1);
        l.addVertex(x2, y2);

        l.draw();
    }
	gui.draw();
}



void ofApp::mousePressed(int x, int y, int button){
	if (x >= 0 && x < img.getWidth() && y >= 0 && y < img.getHeight()) {
		cv::Point p(x, y);
		keyPoints.push_back(p);
	}
}
