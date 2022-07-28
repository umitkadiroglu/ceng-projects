#!/usr/bin/python3

"""
Ümit Kadiroğlu
170709002
"""
import os, requests, uuid, hashlib
from multiprocessing import Pool

url = ["http://wiki.netseclab.mu.edu.tr/images/thumb/f/f7/MSKU-BlockchainResearchGroup.jpeg/300px-MSKU-BlockchainResearchGroup.jpeg","https://upload.wikimedia.org/wikipedia/tr/9/98/Mu%C4%9Fla_S%C4%B1tk%C4%B1_Ko%C3%A7man_%C3%9Cniversitesi_logo.png","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Hawai%27i.jpg/1024px-Hawai%27i.jpg","http://wiki.netseclab.mu.edu.tr/images/thumb/f/f7/MSKU-BlockchainResearchGroup.jpeg/300px-MSKU-BlockchainResearchGroup.jpeg","https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Hawai%27i.jpg/1024px-Hawai%27i.jpg"]

def download_file(url,file_name = None):
	r = requests.get(url, allow_redirects = True)
	file = file_name if file_name else str(uuid.uuid4())
	open(file, 'wb').write(r.content)


#question 1
child = os.fork()

#question 2
if child == 0:
    print("PID of child process: ", os.getpid())
    download_file(url[0],"file01")
    download_file(url[1],"file02")
    download_file(url[2],"file03")
    download_file(url[3],"file04")
    download_file(url[4],"file05")
    os._exit(0)

#question 3
os.wait()



#question 4
files = ["file01", "file02", "file03", "file04", "file05"]
checksum = [hashlib.md5(open("file01",'rb').read()).hexdigest(), hashlib.md5(open("file02",'rb').read()).hexdigest(), hashlib.md5(open("file03",'rb').read()).hexdigest(), hashlib.md5(open("file04",'rb').read()).hexdigest(), hashlib.md5(open("file05",'rb').read()).hexdigest()]





def getFileHash(file):
    x = hashlib.md5(open(file,'rb').read()).hexdigest()
    checksum.append(x)
    if checksum.count(x) > 2:
        print("File", file, "has a duplicate.")


with Pool(5) as p:
    p.map(getFileHash, ["file01", "file02", "file03", "file04", "file05"])



"""
getFileHash(files[0])
getFileHash(files[1])
getFileHash(files[2])
getFileHash(files[3])
getFileHash(files[4])
"""

