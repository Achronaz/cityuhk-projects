#pragma once

#include "ofMain.h"
#include "ofxCv.h"
#include "ofxOpenCv.h"
#include "ofxGui.h"

using namespace ofxCv;
using namespace cv;

class boxFilterApp : public ofBaseApp {

public:
    void setup();
    void draw();
    ofImage imgLena;
    ofImage imgCircuit;
    Mat matLena;
    Mat matCircuit;
};

class gaussianFilterApp : public ofBaseApp {
public:
    int variant;
    gaussianFilterApp(int v) {
        variant = v;
    }
    void setup();
    void draw();
    
    ofImage imgLena;
    ofImage imgCircuit;
    Mat matLena;
    Mat matCircuit;
};

class medianFilterApp : public ofBaseApp {

public:
    void setup();
    void draw();
    ofImage imgLena;
    ofImage imgCircuit;
    Mat matLena;
    Mat matCircuit;
};

