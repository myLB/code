class vue {
    constructor (options) {
        this.$options = options && Object.prototype.toString.call(options) === "[object Object]"? options : {};
        let vm = this;
        initState(vm);
        initWatch(vm)
    }
}
class Dep {
    constructor () {
        this.list = [];
    }
    addWtch (watch) {
        this.list.push(watch);
    }
    depend () {
        if(Dep.target) {
            Dep.target.addDep(this)
        }
    }
    update () {
       for(let i of this.list) {
           this.list[i].update();
       }
    }

}
Dep.target = undefined;
let watcher = []
let id = 0
function getter(vm, key) {
    return vm[key]
}
class Watch {
    constructor (vm, options) {
        this.id = ++id;
        this.options = options || {}
        this.deps = [];
        this.getter = getter(vm, options.key);
        this.value = this.get();
    }
    get () {
        if(Dep.target) watcher.push(Dep.target)
        Dep.target = this;
        let value = this.getter();
        Dep.target = watcher.pop();
        return value;
    }
    addDep (dep) {
        dep.addWtch(this);
    }
    update () {
        queueWatcher(this)
    }
}
let queue = [], ids = [];
function queueWatcher (watch) {
    if(!ids.includes(id)) {
        queue.push(watch)
    }
    Promise.resolve().then(() => {
        for(let i = 0; i < queue.length; i++) {
            queue[i].run();
        }
        queue = [], ids = [];
    })
}
// 让对象可遍历
function traverseObject(obj) {
    obj[Symbol.iterator] = function* () {
        let keys = Object.keys(this);
        for(let [index, key] of keys.entries()) {
            yield [key, obj[key], index]
        }
    }
}
// 初始化data
function initState(vm) {
    judgeData(vm.$options.data);
    new Proxy(vm, {
        get (target, key) {
            return vm.$options.data[key]
        }
    })
}
function judgeData(data) {
    if(Object.prototype.toString.call(data) === "[object Object]") {
        traverseObject(data);
        for(let [key, value, index] of data) {
            if(value) judgeData(value);
        }
        obSever(data)
    }
    if(Array.isArray(value)) {
       for(let obj of data) {
           judgeData(obj)
       }
    }
}
function obSever(data) {
    let dep = new Dep();
    new Proxy(data, {
        get (target, key) {
            if(target)dep.push(target);
            return target[key];
        },
        set (target, key, value) {
            judgeData(value);
            target[key] = value;
            dep.update();
        }
    })
}

function initWatch(vm) {
    traverseObject(vm.$options.watch);
    for(let [key, value, index] of vm.$options.watch) {
        new Watch(vm, {
            key: key,
            cb: value
        })
    }
}