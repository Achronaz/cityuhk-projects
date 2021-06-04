#pragma once

#include "ofMain.h"
#include "ofxOpenCv.h"
#include "ofxCv.h"
#include "ofxGui.h"

#define MAXPOINTS 100

using namespace ofxCv;
using namespace cv;

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();
		void keyPressed(int key);

		ofVideoGrabber vidGrabber;
		ofImage im;
		Mat mat;
		Mat mat_HSV;
		Mat mat_HSV_Threshold;
		ofxPanel gui;
		ofxIntSlider minH;
		ofxIntSlider maxH;
		ofxIntSlider minS;
		ofxIntSlider maxS;
		ofxIntSlider minV;
		ofxIntSlider maxV;
		ofxCvContourFinder contourFinder;

		bool drawing;
		ofFbo fbo;
		ofPoint pts[MAXPOINTS];
		int nPts = 0;
		ofPolyline polyline;
		int width = 640;
		int height = 480;

};
