#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    myVideoGrabber.initGrabber(320, 240);
}

//--------------------------------------------------------------
void ofApp::update(){
    myVideoGrabber.update();

    if (myVideoGrabber.isFrameNew()) {

        //draw frame
        imgCam.setFromPixels(myVideoGrabber.getPixels());
        matCam = toCv(imgCam);
        cvtColor(matCam, matCam, CV_BGR2GRAY);

        //invert color if color selected
        if (pixelSelected) {
            for (int r = 0; r < matCam.rows; r++) {
                for (int c = 0; c < matCam.cols; c++) {
                    if (matCam.at<char>(r, c) > pixelSelected - 25 &&
                        matCam.at<char>(r, c) < pixelSelected + 25) {
                        matCam.at<char>(r, c) = 255 - pixelSelected % 255;
                    }
                }
            }
        }

        //draw histogram
        int histSize = 256;
        float range[] = { 0, 256 };
        const float* histRange = { range };
        calcHist(&matCam, 1, 0, Mat(), hist, 1, &histSize, &histRange);
        normalize(hist, hist, 0, 400, NORM_MINMAX);
        for (int i = 0; i < histSize; i++) {
            histCols[i].clear();
            histCols[i].addVertex(i + 10, 768);
            histCols[i].addVertex(i + 10, 768 - cvRound(hist.at<float>(i)));
        }
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    ofBackground(255, 255, 255);
    ofSetColor(255);
    drawMat(matCam, 0, 0);

    ofSetColor(0, 0, 0);
    for (int i = 0; i < 256; i++) {
        histCols[i].draw();
    }
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    if (x <= 320 && y <=240) {
        try {
            //pixelSelected = matCam.data[x * y];
            pixelSelected = matCam.at<char>(x, y);
        } catch (std::exception& ex) {
            cerr << "exception caught: " << ex.what() << endl;
        }
    }
}
