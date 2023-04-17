clc;
clear all;
close all;
warning off;

testfile = '/MATLAB Drive/kidneyStoneDetection/kidneyWithStone';
frames = dir(fullfile(testfile, '*.*'));
len = length(frames);

for i=3:len
    imgpath(i,:) = fullfile(testfile, frames(i).name);
    I = imread(imgpath(i,:));
    segmentProcess(I, frames(i).name);
end