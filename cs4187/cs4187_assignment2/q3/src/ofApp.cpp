#include "ofApp.h"

void ofApp::setup(){

    ofSetFrameRate(120);

    gui.setup();
    gui.add(lowThreshold.setup("low threshold", 50, 0, 100));

    im.load("T3.jpg"); //try T1.JPG or T2.JPG or T3.JPG
    im.setImageType(OF_IMAGE_COLOR);
    mat = toCv(im);
    cvtColor(mat, mat, CV_BGR2GRAY);
    GaussianBlur(mat, mat, 3);
    Canny(mat, edgeResult, lowThreshold, lowThreshold * 2);

    upDown = 1; // 0 = up, 1 = down

    //search starting point from left to right, bottom to up 
    bool found = false;
    for (int c = 0; c < edgeResult.cols; ++c) {
        if (found) break;
        for (int r = edgeResult.rows - 1; r >= 0 ; r--) {
            if (edgeResult.at<uchar>(r,c)) {
                found = true;
                xPos = c;
                yPos = r;
                break;
            }
        }
    }

}

void ofApp::update(){

    cout << "upDown:" << upDown << ", (x,y): " << xPos << "," << yPos << endl;
    bool found = false;
    for (int i = 9; i > 0; i--) {
        int newX = upDown == 1 ? xPos + 1 : xPos - 1;
        int newY = upDown == 1 ? yPos + (5 - i) : yPos + (i - 5);
        if (edgeResult.at<uchar>(newY, newX)) {
            yPos = newY;
            xPos = newX;
            found = true;
            break;
        }
    }

    //no edge found
    if (!found) {
        if (!edgeResult.at<uchar>(yPos + 2, xPos + 1) &&
            !edgeResult.at<uchar>(yPos + 1, xPos + 1) &&
            !edgeResult.at<uchar>(yPos + 0, xPos + 1) &&
            !edgeResult.at<uchar>(yPos - 1, xPos + 1) &&
            !edgeResult.at<uchar>(yPos - 2, xPos + 1)) {
            //no more edge on right side
            upDown = 0;
        } else if ( 
            !edgeResult.at<uchar>(yPos + 2, xPos - 1) &&
            !edgeResult.at<uchar>(yPos + 1, xPos - 1) &&
            !edgeResult.at<uchar>(yPos + 0, xPos - 1) &&
            !edgeResult.at<uchar>(yPos - 1, xPos - 1) &&
            !edgeResult.at<uchar>(yPos - 2, xPos - 1)) {
            //no more edge on left side
            upDown = 1;
        }
    }

}

void ofApp::draw(){
    ofSetColor(255, 255, 255);
    im.draw(0, 0);
    Canny(mat, edgeResult, lowThreshold, lowThreshold * 2);
    drawMat(edgeResult, 0, im.getHeight());
    ofFill();
    ofDrawCircle(xPos, yPos, 16);
    gui.draw();
}

