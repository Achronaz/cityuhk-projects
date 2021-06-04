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
		void keyPressed(int key);
    
    ofVideoGrabber vidGrabber;
    ofImage im;
    Mat matCam, matCamGrey, matCamPreGrey;
    vector<Point2f> previousPts, currentPts, directions;
    bool initialize, shaking, nodding;
    int MAX = 500;
    vector<cv::Point> facePts;
    CascadeClassifier face_cascade;
    std::vector<cv::Rect> faces;

};