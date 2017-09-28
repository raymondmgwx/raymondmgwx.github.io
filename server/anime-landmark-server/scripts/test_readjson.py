# -*- coding: utf-8 -*-
"""
Created on Thu Sep 28 16:20:59 2017

@author: oukyoku_wangxu
"""

import json
import cv2 as cv

f = open("./json/anime_landmark_data.json", encoding='utf-8')  
setting = json.load(f)
data = setting['landmarkData']

imagename = setting['landmarkData'][1]['image_name']
y_array =setting['landmarkData'][1]['y_coordinate']
x_array =setting['landmarkData'][1]['x_coordinate']

img = cv.imread('./result/'+imagename)

for d in range(0,len(y_array)):
    cv.circle(img,(int(x_array[d]),int(y_array[d])),1,(0,0,255),1)
cv.imwrite('./testimage/1.jpg',img)