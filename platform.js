'use strict';

let currentPath = process.cwd();

function sysSeparator (){
    if (process.platform === "win32"){
        return "\\";
    }else {
        return "/";
    }
}

module.exports = function appPath(appName){
    return currentPath + sysSeparator() + appName;
}

//module.exports.appPath = appPath;