#include "ofApp.h"
#include <filesystem>
namespace fs = std::filesystem;

void ofApp::setup(){

    videoGrabber.initGrabber(640, 480);  
    //need to use absolute path here, for the latest version of OpenFrameworks and its OpenCV addon
    if (!face_cascade.load(fs::current_path().string() + "\\data\\haarcascade_frontalface_default.xml")) {
        cout<<"Error loading"<<endl;
    }
}

void ofApp::update(){
    videoGrabber.update();
    img.setFromPixels(videoGrabber.getPixels());
    mat = toCv(img);
    //try CV_HAAR_SCALE_IMAGE or CASCADE_SCALE_IMAGE for different version of OPENCV
    face_cascade.detectMultiScale(mat, faces, 1.1, 2, 0 | CASCADE_SCALE_IMAGE, cv::Size(30, 30));
}

void ofApp::draw(){
    drawMat(mat, 0, 0);
    for(int i = 0; i < faces.size(); i++){
        ofNoFill();
        ofDrawRectangle(faces.at(i).x, faces.at(i).y, faces.at(i).width, faces.at(i).height);
    }
}
