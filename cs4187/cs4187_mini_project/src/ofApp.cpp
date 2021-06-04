#include "ofApp.h"

//default       :0,   180, 0,  255, 0,   255
//green         :0,   48,  81, 255, 147, 255
//skin          :108, 179, 23, 255, 81,  255

void ofApp::setup(){
    
    //gui setup
    gui.setup();
    gui.setPosition(640, 0);
    gui.add(labelBlobs.setup("Blob Detection",""));
    gui.add(minH.setup("min H", 0, 0, 255));
    gui.add(maxH.setup("max H", 48, 0, 255));
    gui.add(minS.setup("min S", 81, 0, 255));
    gui.add(maxS.setup("max S", 255, 0, 255));
    gui.add(minV.setup("min V", 147, 0, 255));
    gui.add(maxV.setup("max V", 255, 0, 255));
    gui.add(minSize.setup("min Size", 200, 0, 9600));
    gui.add(maxSize.setup("max Size", 76800, 9600, 76800));
    gui.add(labelLine.setup("Line Setting", ""));
    gui.add(lineWidth.setup("line width", 3, 1, 16));
    gui.add(lineColor.setup("line color", ofColor(255, 255, 255, 255), ofColor(0, 0, 0, 0), ofColor(255, 255, 255, 255)));

    //project draw setup
    fbo.allocate(width, height);
    fbo.begin();
    ofClear(255);
    fbo.end();

    vidGrabber.initGrabber(width, height);
    drawing = false;
    ofEnableSmoothing();
    
}

void ofApp::update(){

    vidGrabber.update();
    if (vidGrabber.isFrameNew()) {
        im.setFromPixels(vidGrabber.getPixels());
        im.mirror(0, 1);
        mat = toCv(im);
        cvtColor(mat, mat_HSV, CV_BGR2HSV);
        inRange(mat_HSV, Scalar(minH, minS, minV), Scalar(maxH, maxS, maxV), mat_HSV_Threshold);
        erode(mat_HSV_Threshold, mat_HSV_Threshold, Mat());
        dilate(mat_HSV_Threshold, mat_HSV_Threshold, Mat());
        ofImage im_temp;
        toOf(mat_HSV_Threshold, im_temp);
        ofxCvGrayscaleImage im_temp_gray;
        im_temp_gray.setFromPixels(im_temp.getPixels());
        contourFinder.findContours(im_temp_gray, minSize, maxSize, 4, false, true);

    }

}

void ofApp::draw(){
    //project draw screen
    ofSetColor(255, 255, 255);
    drawMat(mat, 0, 0);
    ofSetColor(255, 0, 0);
    //bounding box
    for (int i = 0; i < contourFinder.nBlobs; i++) {
        ofRectangle r = contourFinder.blobs.at(i).boundingRect;
        ofSetLineWidth(2);
        ofNoFill();
        ofDrawRectangle(r);
        int x = contourFinder.blobs.at(i).centroid.x;
        int y = contourFinder.blobs.at(i).centroid.y;
        ofSetColor(lineColor);
        ofSetLineWidth(lineWidth);
        ofFill();
        ofDrawCircle(x, y, lineWidth);
    }
    //debug screen
    ofSetColor(255, 255, 255);
    drawMat(mat_HSV_Threshold, 0, mat.rows);
    gui.draw();

    //text instruction
    ofSetColor(255, 255, 255);
    ofDrawBitmapString(
        string("Instruction: \n") +
        string("1. press 'd' to toggle \n") +
        string("draw.\n") +
        string("2. press 'c' to clear \n") +
        string("all lines.\n") +
        string("3. press 's' to save as \n") +
        string("jpeg.\n")
        , 645, 505);

    //drawing line when drawing mode on and only one blob be detected
    
    if (drawing && contourFinder.nBlobs == 1) {
        int x = contourFinder.blobs.at(0).centroid.x;
        int y = contourFinder.blobs.at(0).centroid.y;
        if (nPts < MAXPOINTS) {
            pts[nPts].x = x;
            pts[nPts].y = y;
            nPts++;
        }
        //draw line
        ofSetColor(lineColor);
        ofSetLineWidth(lineWidth);
        polyline.addVertex(ofPoint(x, y));
        fbo.begin();
        polyline.draw();
        fbo.end();

    } else if (!drawing){
        //clear line
        fbo.begin();
        polyline.clear();
        fbo.end();
    }
    //draw project
    fbo.draw(0, 0);
}

void ofApp::keyPressed(int key){
    switch (key) {
        case 'd':
            drawing = !drawing;
            nPts = 0;
            break;
        case 'c':
            fbo.begin();
            ofClear(255);
            fbo.end();
            break;
        case 's':
            im.grabScreen(0, 0, fbo.getWidth(), fbo.getHeight());
            im.getPixels().swapRgb();
            im.save("screenshot_" + ofToString(count, 3, '0') + ".jpg");
            count++;
            break;
        default:break;
    }
}