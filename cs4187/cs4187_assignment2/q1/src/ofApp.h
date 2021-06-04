#pragma once


#include "ofMain.h"
#include "ofxCv.h"
#include "ofxOpenCv.h"
#include "ofxGui.h"

using namespace ofxCv;
using namespace cv;

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();
		void mousePressed(int x, int y, int button);


		ofVideoPlayer video;

		ofxPanel gui;
		ofxIntSlider lowThreshold;
		ofxIntSlider lineVoteThreshold;

		ofImage img;
		Mat imgMat;

		Mat mask;
		vector<cv::Point> keyPoints;
};
