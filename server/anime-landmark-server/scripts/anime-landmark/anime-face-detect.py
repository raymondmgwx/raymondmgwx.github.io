# -*- coding: utf-8 -*-
"""
Created on Thu Sep 28 14:20:45 2017

@author: oukyoku_wangxu
"""

import cv2
import sys
import os.path
import os


path = './dataset/'
dirs = os.listdir(path)
index = 1
for dir in dirs:
    #change file name
    #os.rename(path+dir,str(index)+'.jpg')
    
    imagepath = path+dir
    face_cascade = cv2.CascadeClassifier(r'./haar-xml/lbpcascade_animeface.xml')

    image = cv2.imread(imagepath)
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)


    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor = 1.1,
        minNeighbors = 5,
        minSize = (24, 24)
    )
    
    if len(faces) == 1:
        cv2.imwrite('./result/'+str(index)+'.jpg',image)
    
    index = index  + 1





