function resolve(promise, value) {
    if(value === promise) {
        reject(promise, 'It can\'t be itself');
    }else if ((typeof value === 'object' || typeof value === 'function') && value !== null) {
        if(value.constructor === promise.constructor) {
            let {_status, _result} = value;
            if(_status === fulfilled) {
                fill(promise, _result);
            }else if(_status === rejected) {
                reject(promise, _result)
            }else {
                value.callbacks.push(undefined, data => {
                    resolve(promise, data)
                }, reason => {
                    reject(promise, reason)
                })
            }
        }else if(typeof value.then === 'function'){
            try{
                value.then(value => {
                    resolve(promise, value);
                }, reason => {
                    reject(promise, reason);
                })
            } catch (e) {
                reject(promise, e);
            }
        }else {
            fill(promise, value);
        }
    }else {
        fill(promise, value);
    }
}
function fill(promise, value) {
    promise._result = value;
    promise._status = fulfilled;
    //异步执行回调函数
    asyncExecute(promise);
}
function asyncExecute (promise) {
    let {_result, _status, callbacks} = promise;
    setTimeout(() => {
        for(let i = 0; i < callbacks.length; i+=3) {
            try {
                let data, child = callbacks[0];
                // 没有相应状态的回调函数
                if(callbacks[_status]) {
                    data = callbacks[_status](_result);
                }
                if(child){
                    _status === fulfilled? resolve(child, data) : reject(child, data);
                }
            }catch(e) {
                reject(callbacks[0], e);
            }
        }
        promise.callbacks.length = 0;
    })
}
function reject(promise, reason) {
    promise._result = reason;
    promise._status = rejected;
    asyncExecute(promise);
}
const pending = 0, fulfilled = 1, rejected = 2;
class Promise1 {
    constructor (resolver) {
        this._result = undefined;
        this._status = pending;
        this.callbacks = [];
        if(typeof resolver !== 'function') throw new TypeError('resolver is not a function');
        if(this instanceof Promise1) {
            try {
                resolver((value) => {
                    resolve(this, value)
                }, (reason) => {
                    reject(this, reason)
                })
            }catch (e) {
                reject(this, e)
            }
        }else {
            throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }
    }
    then (onFulfilled, onRejected) {
        const parent = this;
        const child = new this.constructor(() => {})
        parent.callbacks.push(...[child, onFulfilled, onRejected]);
        return child
    }
    catch (onRejected) {
        this.then(null, onRejected);
    }
}
Promise1.prototype[Symbol.toStringTag] = 'Promise1';
let obj;
new Promise1((res, rej) => {
    obj = res;
}).then(console.log)
setTimeout(() => {
    let m;
    obj(new Promise1((res) => {
        m = res;
    }))
    setTimeout(() => {
        m(4)
    }, 3000)
}, 2000)
/*
    核心思想:  每一个catch或then都生成一个pending状态的promise实例简称obj1,并将这个实例以及回调函数放入父实例的callbacks数组中.
              当执行父实例的resolve时,去执行callbacks数组中收集的then回调函数并将返回值作为obj1的result,然后执行obj1的callbacks
              数组中收集的回调函数,前提是callbacks不为空数组。然后就是一直这样下去
*/