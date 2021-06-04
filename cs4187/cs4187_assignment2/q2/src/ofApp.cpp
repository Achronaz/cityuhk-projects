#include "ofApp.h"

void ofApp::setup(){
    gui.setup();
    gui.add(lowThreshold.setup("low threshold", 50, 0, 100));
    videoGrabber.initGrabber(1024, 768);
}

void ofApp::update(){
    videoGrabber.update();
    im.setFromPixels(videoGrabber.getPixels());
    mat = toCv(im);
    cvtColor(mat, mat, CV_BGR2GRAY);
}

void ofApp::draw(){
    ofBackground(255);
    ofSetColor(255, 255, 255);
    im.draw(0, 0);
    GaussianBlur(mat, mat, 3);
    Canny(mat, mat, lowThreshold, lowThreshold * 2);
    drawMat(mat, im.getWidth(), 0);
    vector<Vec3f> circles;
    HoughCircles(mat, circles, CV_HOUGH_GRADIENT, 2, 50, lowThreshold * 2, 100, 30, 50);
    for (int i = 0; i < circles.size(); i++) {
        ofSetColor(255, 255, 255);
        ofFill();
        ofDrawCircle(circles[i][0], circles[i][1], circles[i][2]);
        ofSetColor(0, 0, 0);
        ofNoFill();
        ofDrawCircle(circles[i][0], circles[i][1], circles[i][2]);
        ofSetColor(0, 0, 0);
        ofFill();
        ofDrawCircle(circles[i][0], circles[i][1], circles[i][2]/2);
    }
    gui.draw();
    
}