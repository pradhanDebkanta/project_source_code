clc;
clear all;
close all;
warning off;
[filename, pathname] = uigetfile('*.*', 'select a image file');
filename = strcat(pathname, filename);
a = imread(filename);
displayFig(a);
s = size(a, 3);
if(s==3)
    b = rgb2gray(a);
else
    b=a;
end
%displayFig(b);
imhist(b);
c = b>20;
%displayFig(c);
d = imfill(c, 'holes');
%displayFig(d);
e = bwareaopen(d, 1000);
%displayFig(e);
preprocessimage = uint8(double(a).*repmat(e, [1 1 3]));
%displayFig(preprocessimage);
%contrastenhancement
preprocessimage = imadjust(preprocessimage, [0.3, 0.7],[])+40;
%displayFig(preprocessimage);
uo = rgb2gray(preprocessimage);
displayFig(uo);
% remove sorounding part use median filter, it can also be use morfological filter
mo = medfilt2(uo, [5,5]);
displayFig(mo);
impixelinfo;
po = mo>250;
displayFig(po);
[r, c, m] = size(po);
x1 = r/2;
y1 = c/3;
row =[x1, x1+200, x1+200, x1];
col = [y1, y1, y1+40, y1+40];
bw = roipoly(po,row, col);
%displayFig(bw);
k = po.*double(bw);
displayFig(k);
m = bwareaopen(k, 4);
[ya, number] = bwlabel(m);
if(number>=1)
    disp('Stone detected');
else
    disp('Stone not detected');
end