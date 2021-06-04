#pragma once

#include "ofMain.h"
#include "ofxOpenCv.h"
#include "ofxCv.h"
#include "ofxGui.h"

#define MAXPOINTS 500

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
		Mat mat, mat_HSV, mat_HSV_Threshold;

		ofxPanel gui;
		ofxIntSlider minH, maxH, minS, maxS, minV, maxV, minSize, maxSize;
		ofxIntSlider lineWidth;
		ofxColorSlider lineColor;
		ofxLabel labelBlobs;
		ofxLabel labelLine;

		ofxCvContourFinder contourFinder;

		bool drawing;
		ofFbo fbo;
		ofPoint pts[MAXPOINTS];
		ofPolyline polyline;
		int nPts = 0, width = 640, height = 480, count = 0;
		//cvConvexHull2
		
			
};
