learning-threejs
================

## Second edition learning Three.js

The examples in this branch are based on r63 and correspond to the second edition of "Learning Three.js"

## Third edition Learning Three.js

The examples for the third edition of this book can be found in the following repo

https://github.com/josdirksen/learning-threejs-third


#---------------------------------------------------------------
#step1:设置AA_root_path/lighttpd.conf的配置
server.document-root        = "/home/shuaiduan/01-Code/line_web/learning-threejs"
server.upload-dirs          = ("/home/shuaiduan/01-Code/line_web/AA_root_path/uploads")
server.errorlog             = "/home/shuaiduan/01-Code/line_web/AA_root_path/log/error.log"
server.pid-file             = "/home/shuaiduan/01-Code/line_web/AA_root_path/run/lighttpd.pid"

compress.cache-dir          = "/home/shuaiduan/01-Code/line_web/AA_root_path/compress/"

#step2:开启lighttpd
/usr/sbin/lighttpd -D  -f ./root_path/config/lighttpd.conf

#step3:浏览器访问地址
eg1:  http://localhost:8888/00_owner/line_smooth.html
eg2:  http://localhost:8888/chapter-09/06-roll-controls-camera.html

#step4：vscode调试可增加配置
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome",
            "url": "http://localhost:8888/00_owner/line_smooth.html",
            "webRoot": "${workspaceFolder}"
        },
