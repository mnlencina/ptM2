'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise (executor){
    if (typeof executor !== 'function') throw new TypeError("executor debe ser una function")
    this._state = 'pending'
    this._value = undefined
    this._handlerGroups = []
    
    const res = (data)=> this._internalResolve(data)
    const rej = (data)=> this._internalReject(data)
    
    executor(res,rej)
}

$Promise.prototype._internalResolve = function(data){
    if(this._state === 'pending') {
        this._state = 'fulfilled'
        this._value = data
        this._callHandlers()
    }
}

$Promise.prototype._internalReject = function(data){
    if(this._state === 'pending') {
        this._state = 'rejected'
        this._value = data
        this._callHandlers()
    }
}

$Promise.prototype.then = function(successCb, errorCb){
    typeof successCb !== 'function' && (successCb = false)
    typeof errorCb !== 'function' && (errorCb = false)
    
    const downstreamPromise = new $Promise(()=>{})
     
    this._handlerGroups.push({successCb, errorCb, downstreamPromise})
    
    if (this._state !== 'pending') this._callHandlers()
    
    return downstreamPromise;
}

$Promise.prototype.catch = function (errorCb){
    return this.then(null, errorCb)
}

$Promise.prototype._callHandlers = function(){
    while(this._handlerGroups.length){
        const handler = this._handlerGroups.shift();
        
        if(this._state === 'fulfilled') {
            if(handler.successCb) {
                try {
                    const result = handler.successCb(this._value)
                    if(result instanceof $Promise){
                        return result.then(
                            value => handler.downstreamPromise._internalResolve(value),
                            error => handler.downstreamPromise._internalReject(error)
                        )
                    } else handler.downstreamPromise._internalResolve(result)
                    
                } catch (error) {
                    handler.downstreamPromise._internalReject(error)
                }
            } else return handler.downstreamPromise._internalResolve(this._value)
        };       
        //this._state === 'rejected' && handler.errorCb && handler.errorCb(this._value);  
        
        if(this._state === 'rejected') {
            if(handler.errorCb) {
                try {
                    const result = handler.errorCb(this._value)
                    if(result instanceof $Promise){
                        return result.then(
                            value => handler.downstreamPromise._internalResolve(value),
                            error => handler.downstreamPromise._internalReject(error)
                        )
                    } else handler.downstreamPromise._internalResolve(result)
                    
                } catch (error) {
                    handler.downstreamPromise._internalReject(error)
                }
            } else return handler.downstreamPromise._internalReject(this._value)
        };
    }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
