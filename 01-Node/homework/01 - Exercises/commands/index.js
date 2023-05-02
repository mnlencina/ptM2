const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");


function pwd(print) {
    print(process.cwd())
}

function date(print) {
    print(Date());
}

function echo(print, args) {
    print(args)
}

function ls(print) {
    fs.readdir('.', (error, files)=>{
        if(error) throw Error(error);
        print(files.join(' '))
    })
}

function cat(print, args) {
    fs.readFile(args, 'utf-8', (error, data)=>{
        if(error) throw Error(error);
        print(data)
    })
}

function head(print, args) {
    fs.readFile(args, 'utf-8', (error, data)=>{
        if(error) throw Error(error);
        print(data.split('\n').at(0))
    })
}

function tail(print, args) {
    fs.readFile(args, 'utf-8', (error, data)=>{
        if(error) throw Error(error);
        print(data.split(' ').at(-1))
    })
}

function curl(print, args) {
    !args.startsWith('https://') && !args.startsWith('http://') &&(args = 'https://' + args);
    utils.request(args, (error, response)=>{
        if (error) return Error(error)
        // print(response)
        print(response.data)
    
    })
}

module.exports = {pwd, date, echo, ls, cat, head, tail, curl};
