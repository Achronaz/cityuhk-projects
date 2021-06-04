#include "ofApp.h"

void boxFilterApp::setup() {
    imgLena.load("lena.jpg");
    imgLena.setImageType(OF_IMAGE_GRAYSCALE);
    matLena = toCv(imgLena);
    imgCircuit.load("circuit.tif");
    imgCircuit.setImageType(OF_IMAGE_GRAYSCALE);
    matCircuit = toCv(imgCircuit);
}

void boxFilterApp::draw() {
    int kernelSizes[5] = { 3,5,7,9,11 };
    Mat boxResult;
    for (int i = 0; i < 5; i++) {
        boxFilter(matLena, boxResult, -1, cv::Size(kernelSizes[i], kernelSizes[i]));
        drawMat(boxResult, imgLena.getWidth() * i, imgLena.getHeight() * 0);
        boxFilter(matCircuit, boxResult, -1, cv::Size(kernelSizes[i], kernelSizes[i]));
        drawMat(boxResult, imgCircuit.getWidth() * i, imgLena.getHeight() * 1);
    }
}

void gaussianFilterApp::setup() {
    imgLena.load("lena.jpg");
    imgLena.setImageType(OF_IMAGE_GRAYSCALE);
    matLena = toCv(imgLena);
    imgCircuit.load("circuit.tif");
    imgCircuit.setImageType(OF_IMAGE_GRAYSCALE);
    matCircuit = toCv(imgCircuit);
}

void gaussianFilterApp::draw() {
    int kernelSizes[5] = { 3,5,7,9,11 };
    Mat gaussianResult;
    for (int i = 0; i < 5; i++) {
        GaussianBlur(matLena, gaussianResult, cv::Size(kernelSizes[i], kernelSizes[i]), variant);
        drawMat(gaussianResult, imgLena.getWidth() * i, imgLena.getHeight() * 0);
        GaussianBlur(matCircuit, gaussianResult, cv::Size(kernelSizes[i], kernelSizes[i]), variant);
        drawMat(gaussianResult, imgCircuit.getWidth() * i, imgLena.getHeight() * 1);
    }
}

void medianFilterApp::setup() {
    imgLena.load("lena.jpg");
    imgLena.setImageType(OF_IMAGE_GRAYSCALE);
    matLena = toCv(imgLena);
    imgCircuit.load("circuit.tif");
    imgCircuit.setImageType(OF_IMAGE_GRAYSCALE);
    matCircuit = toCv(imgCircuit);
}

void medianFilterApp::draw() {
    int kernelSizes[5] = { 3,5,7,9,11 };
    Mat medianResult;
    for (int i = 0; i < 5; i++) {
        medianBlur(matLena, medianResult, kernelSizes[i]);
        drawMat(medianResult, imgLena.getWidth() * i, imgLena.getHeight() * 0);
        medianBlur(matCircuit, medianResult, kernelSizes[i]);
        drawMat(medianResult, imgCircuit.getWidth() * i, imgLena.getHeight() * 1);
    }
}