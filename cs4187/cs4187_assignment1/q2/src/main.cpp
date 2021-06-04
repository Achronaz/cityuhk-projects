#include "ofMain.h"
#include "ofApp.h"


int main( ){

    ofGLWindowSettings settings;
    settings.setSize(2560, 1440);
    
    settings.title = "boxFilterApp";
    auto boxFilterWindow = ofCreateWindow(settings);

    settings.title = "gaussianFilterApp4";
    auto gaussianFilterWindow4 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp5";
    auto gaussianFilterWindow5 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp6";
    auto gaussianFilterWindow6 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp7";
    auto gaussianFilterWindow7 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp8";
    auto gaussianFilterWindow8 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp9";
    auto gaussianFilterWindow9 = ofCreateWindow(settings);
    settings.title = "gaussianFilterApp10";
    auto gaussianFilterWindow10 = ofCreateWindow(settings);

    settings.title = "medianFilterApp";
    auto medianFilterWindow = ofCreateWindow(settings);

    //Box Filter
    //kernelSizes: 3,5,7,9,11
    ofRunApp(boxFilterWindow, std::make_shared<boxFilterApp>());

    //Gaussian Filter
    //kernelSizes: 3,5,7,9,11 and variant: 4,5,6,7,8,9,10
    ofRunApp(gaussianFilterWindow4, std::make_shared<gaussianFilterApp>(4));
    ofRunApp(gaussianFilterWindow5, std::make_shared<gaussianFilterApp>(5));
    ofRunApp(gaussianFilterWindow6, std::make_shared<gaussianFilterApp>(6));
    ofRunApp(gaussianFilterWindow7, std::make_shared<gaussianFilterApp>(7));
    ofRunApp(gaussianFilterWindow8, std::make_shared<gaussianFilterApp>(8));
    ofRunApp(gaussianFilterWindow9, std::make_shared<gaussianFilterApp>(9));
    ofRunApp(gaussianFilterWindow10, std::make_shared<gaussianFilterApp>(10));

    //Median Filter
    //kernelSizes: 3,5,7,9,11
    ofRunApp(medianFilterWindow, std::make_shared<medianFilterApp>());

    ofRunMainLoop();

}
