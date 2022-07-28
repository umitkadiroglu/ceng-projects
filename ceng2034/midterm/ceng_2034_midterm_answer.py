#!/usr/bin/python3
import os, threading, requests


#question1
pid = os.getpid()

print("PID of this process: ", pid)

#question2
current_os = os.name

if (current_os == "posix"):
    print("loadavg: ", os.getloadavg())

#question3
loadavg = os.getloadavg()
cpu_count = os.cpu_count()

print("5 min loadavg: ", loadavg[1])
print("CPU core count: ", cpu_count)

if (cpu_count - loadavg[1] < 1):
    exit()


#question4
def requester(url):
    response = requests.get(url)
    if(response.status_code == 200):
        print(url, " is VALID")
    else:
        print(url, " is INVALID")


thread1 = threading.Thread(target=requester, args=('https://api.github.com',))
thread2 = threading.Thread(target=requester, args=('http://bilgisayar.mu.edu.tr/',))
thread3 = threading.Thread(target=requester, args=('https://www.python.org​',))
thread4 = threading.Thread(target=requester, args=('http://akrepnalan.com/ceng2034​',))
thread5 = threading.Thread(target=requester, args=('https://github.com/caesarsalad/wow​',))

thread1.start()
thread2.start()
thread3.start()
thread4.start()
thread5.start()


