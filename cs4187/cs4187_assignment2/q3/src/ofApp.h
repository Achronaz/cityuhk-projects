#pragma once

#include "ofMain.h"
#include "ofxOpenCv.h"
#include "ofxCv.h"
#include "ofxGui.h"

using namespace ofxCv;
using namespace cv;
class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		ofImage im;
		Mat mat;
		ofxPanel gui;
		ofxIntSlider lowThreshold;
		Mat edgeResult;
		int xPos,yPos;
		int upDown; // 0 = up, 1 = down
};
