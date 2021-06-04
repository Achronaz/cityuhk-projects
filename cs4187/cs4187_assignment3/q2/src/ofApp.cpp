#include "ofApp.h"

//20,65,100,255,147,255
void ofApp::setup(){
    gui.setup();
    gui.add(minH.setup("min H", 0, 0, 255));
    gui.add(maxH.setup("max H", 180, 0, 255));
    gui.add(minS.setup("min Sd", 0, 0, 255));
    gui.add(maxS.setup("max S", 255, 0, 255));
    gui.add(minV.setup("min V", 0, 0, 255));
    gui.add(maxV.setup("max V", 255, 0, 255));
    vidGrabber.initGrabber(width, height);
    drawing = false;

    fbo.allocate(width, height);
    fbo.begin();
    ofClear(255);
    fbo.end();
}

void ofApp::update(){
    vidGrabber.update();
    if (vidGrabber.isFrameNew()) {
        im.setFromPixels(vidGrabber.getPixels());
        mat = toCv(im);
        cvtColor(mat, mat_HSV, CV_BGR2HSV);
        inRange(mat_HSV, Scalar(minH, minS, minV), Scalar(maxH, maxS, maxV), mat_HSV_Threshold);
        erode(mat_HSV_Threshold, mat_HSV_Threshold, Mat());
        dilate(mat_HSV_Threshold, mat_HSV_Threshold, Mat());
        ofImage im_temp;
        ofxCvGrayscaleImage im_temp_gray;
        toOf(mat_HSV_Threshold, im_temp);
        im_temp_gray.setFromPixels(im_temp.getPixels());
        contourFinder.findContours(im_temp_gray, 5, (width * height) / 4, 4, false, true);
    }

}

void ofApp::draw(){
    ofSetColor(255, 255, 255);
    drawMat(mat, 0, 0);
    for (int i = 0; i < contourFinder.nBlobs; i++) {
        ofRectangle r = contourFinder.blobs.at(i).boundingRect;
        ofSetColor(255, 0, 0);
        ofNoFill();
        ofDrawRectangle(r);
    }

    ofSetColor(255, 255, 255);
    drawMat(mat_HSV_Threshold, mat.cols, 0);
    gui.draw();

    //drawing notification for drawing flag
    ofSetColor(255, 255, 255);
    ofFill();
    if (drawing) {
        ofDrawRectangle(0, 0, 290, 18);
        ofSetColor(255, 0, 0);
        ofDrawBitmapString("Drawing. To stop, please press 's'", 10, 14);
    } else {
        ofDrawRectangle(0, 0, 510, 18);
        ofSetColor(255, 0, 0);
        ofDrawBitmapString("Drawing paused. To resume and draw new lines, please press 's'", 10, 14);
    }

    //drawing green line when drawing turned on and only one blob be detected
    ofSetColor(0, 255, 0);
    fbo.begin();
    if (drawing && contourFinder.nBlobs == 1) {
        int x = contourFinder.blobs.at(0).centroid.x;
        int y = contourFinder.blobs.at(0).centroid.y;
        if (nPts < MAXPOINTS) {
            pts[nPts].x = x;
            pts[nPts].y = y;
            nPts++;
        }
        ofSetLineWidth(2);
        polyline.addVertex(ofPoint(x, y));
        polyline.draw();
    }
    else {
        polyline.clear();
    }
    fbo.end();
    fbo.draw(0, 0);
    
}

void ofApp::keyPressed(int key){
    if (key == 's') {
        nPts = 0;
        drawing = !drawing;
    }
}

