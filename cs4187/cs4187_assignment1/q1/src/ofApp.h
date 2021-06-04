#pragma once

#include "ofMain.h"
#include "ofxCv.h"

using namespace cv;
using namespace ofxCv;

class ofApp : public ofBaseApp{
	public:
		void setup();
		void draw();

		ofImage imgBg;
		ofImage imgRunning;
		Mat matBg;
		Mat matRunning;
};
