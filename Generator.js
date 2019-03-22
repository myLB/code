// 对对象进行遍历
function traverseObject(obj) {
    obj[Symbol.iterator] = function* () {
        let keys = Object.keys(this);
        for(let [index, key] of keys.entries()) {
            yield [key, obj[key], index]
        }
    }
}
let data = {
    name: 'li',
    key: 3
}
traverseObject(data);
for(let [key, value, index] of data) {
    console.log(key, value, index)
}


//自动执行器
function co(gen) {
    let ctx = this;
    return new Promise((res, rej) => {
        if(typeof gen === 'function') gen = gen.call(ctx);
        if(!gen || typeof gen.next !== 'function') return res(gen);//传入的参数不为Generator函数时按原样输出
        onFulfilled();
        function onFulfilled(res) {
            let val;
            try {
                val = gen.next(res)//赋值上一个yield返回值为res
            }catch (e) {
                return rej(e)
            }
            next(val)
        }
        function next(val) {
            console.log(val)
            if(val.done) return res(val.value);//结束循环时将最终结果输出
            let value = val.value;
            // yield后面是一个Promise实例等结果返回在执行下一步
            if(value && typeof value.then === 'function') {
                value.then(res => {
                    console.log(res)
                    return onFulfilled(res)
                })
            }else {
                console.log(value)
                onFulfilled(value)
            }
        }
    })
}
function* gen() {
    yield 1;
    yield new Promise(res => {
        setTimeout(() => {
            res(2)
        },2000)
    })
    return 8
}
//gen()[Symbol.iterator]() === gen(): Generator函数生成的遍历器是Generator函数的实例,遍历器的[Symbol.iterator]函数返回遍历器自身
co(gen)