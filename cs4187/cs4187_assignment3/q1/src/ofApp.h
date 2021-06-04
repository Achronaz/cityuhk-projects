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
    
        ofImage img;
        Mat mat;
		ofVideoGrabber videoGrabber;
        CascadeClassifier face_cascade; //the instance of face detector
        std::vector<cv::Rect> faces; // a vector to store the detected faces
    
};
