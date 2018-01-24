import numpy as np
from PIL import Image
import sys  

def count_black_1d(page):
        nBlack = (arr == 1).sum()
        return nBlack


def count_black_3d_transform(page):
    nBlack = (arr == False).sum()
    return nBlack

pages = sys.argv
pages = pages[1:]
result =[]
white_count = 0
black_count = 0
for i, page in enumerate(pages):
    img = Image.open('./imgs/'+page)
    arr = np.array(img)
    h =arr.shape[0]
    w = arr.shape[1]
    nPixels = h*w
    dim = 0

    
    if len(arr.shape) > 2:
        dim = arr.shape[2]
        img = img.convert('1')
        arr = np.array(img)
        nBlack = count_black_3d_transform(arr)
    else:
        nBlack = count_black_1d(arr)


    black_proportion = nBlack / float(nPixels)
    if (black_proportion) > 0.7:
        black_count += 1
    else:
        white_count += 1

black_rate = black_count/len(pages)
print(black_rate)







# im = Image.open("./imgs/aa_1.png") #Can be many different formats.
# pix = im.load()
# print(im.size) #Get the width and hight of the image for iterating over
# print(pix[0,0]) #Get the RGBA Value of the a pixel of an image