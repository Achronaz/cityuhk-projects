#include "ofApp.h"
#include <filesystem>
namespace fs = std::filesystem;

//--------------------------------------------------------------
void ofApp::setup(){
    shaking = false;
    nodding = false;
    initialize = false;
    vidGrabber.initGrabber(640, 480);
    if (!face_cascade.load(fs::current_path().string() + "\\data\\haarcascade_frontalface_default.xml")) {
        cout << "Error loading" << endl;
    }
}

void ofApp::update(){
    vidGrabber.update();
    TermCriteria termcrit(CV_TERMCRIT_ITER|CV_TERMCRIT_EPS, 20, 0.03);
    Size subPixWinSize(10, 10),winSize(31,31);
    
    if (vidGrabber.isFrameNew()) {

        im.setFromPixels(vidGrabber.getPixels());
        matCam = toCv(im);
        cvtColor(matCam, matCamGrey, CV_BGR2GRAY);
        
        if(initialize){
            //try CV_HAAR_SCALE_IMAGE or CASCADE_SCALE_IMAGE for different version of OPENCV
            //face_cascade.detectMultiScale(matCamGrey, faces, 1.1, 2, 0 | CASCADE_SCALE_IMAGE, cv::Size(80, 80));
            face_cascade.detectMultiScale(matCamGrey, faces, 1.1, 2, 0 | CASCADE_SCALE_IMAGE, Size(30, 30));
            Rect face = faces.front();
            facePts.emplace_back(face.x, face.y);
            facePts.emplace_back(face.x + face.width, face.y);
            facePts.emplace_back(face.x + face.width, face.y + face.height);
            facePts.emplace_back(face.x, face.y + face.height);

            vector<cv::Point2f> faceFrame;
            goodFeaturesToTrack(matCamGrey, faceFrame, MAX, 0.01, (double)10, Mat(), 3, (bool)0, 0.04);
            cornerSubPix(matCamGrey, faceFrame, subPixWinSize, cv::Size(-1, -1), termcrit);

            if (!faceFrame.empty()) {
                std::vector<cv::Point2f>::iterator it = faceFrame.begin();
                int added = 0;
                for (;it != faceFrame.end(); it++) {
                    int x = it->x;
                    int y = it->y;
                    // points inside the face
                    if (x < facePts[1].x && x > facePts[0].x && y < facePts[2].y && y > facePts[1].y) {
                        currentPts.emplace_back(it->x, it->y);
                        added++;
                    }
                }
            }
            initialize = false;
        } else if(!previousPts.empty()){
            //track key points
            vector<uchar> status;
            vector<float> err;
            if (matCamPreGrey.empty()) {
                matCamGrey.copyTo(matCamPreGrey);
            }
            calcOpticalFlowPyrLK(matCamPreGrey, matCamGrey, previousPts, currentPts, status, err, winSize);
            //get directions
            for (int i = 0; i < currentPts.size(); i++) {
                Point2f dir = Point2f(currentPts.at(i).x - previousPts.at(i).x, currentPts.at(i).y - previousPts.at(i).y);
                directions.push_back(dir);
            }
            //get average directions
            Point2f avgDir(0, 0);
            for (int i = 0; i < directions.size(); i++) {
                avgDir.x += directions.at(i).x;
                avgDir.y += directions.at(i).y;
            }
            if (directions.size() != 0) {
                avgDir.x /= directions.size();
                avgDir.y /= directions.size();
            }
            //need to adjust
            if (avgDir.x > 0.1 || avgDir.x < -0.1) {
                shaking = true; nodding = false;
            } else if (avgDir.y > 0.1 || avgDir.y < -0.1) {
                shaking = false; nodding = true;
            } else {
                shaking = false; nodding = false;
            }

        }

        swap(currentPts, previousPts);
        swap(matCamPreGrey, matCamGrey);
    }
}

void ofApp::draw(){
    ofSetColor(255,255,255);
    drawMat(matCam, 0, 0);
    ofDrawRectangle(0, 0, 100, 18);
    ofSetColor(255, 0, 0);
    if(shaking == true) ofDrawBitmapString("Shaking", 10, 14);
    if(nodding == true) ofDrawBitmapString("Nodding", 10, 14);
    if(shaking == false && nodding == false) ofDrawBitmapString("Still", 10, 14);
    if(!previousPts.empty()){
        for(int i = 0; i < currentPts.size(); i++ ) {
            ofSetColor(0,255,0);
            ofDrawCircle(currentPts[i].x, currentPts[i].y, 3);
            ofSetColor(255,0,0);
            ofDrawLine(previousPts[i].x, previousPts[i].y, currentPts[i].x, currentPts[i].y);
        }
    }
}

void ofApp::keyPressed(int key){
    if (key == 'c') {
        previousPts.clear();
        currentPts.clear();
        facePts.clear();
    } else if (key == 'r') {
        initialize = true;
    }
}