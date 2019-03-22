async function handle() {
    const data1 = await function () {
        return 6
    }
    console.log(data1())
    const data2 = await new Promise(res => {
        setTimeout(() => {
            res(7)
        }, 2000)
    })
    console.log(data2)
    return 9
}
/*handle().then(res => {
    console.log(res)
})*/

/*-------------------------------------------------------------------------------------*/

// 实现async...await
function fn() {
    return container(gen)
}
function container(genF) {
    // 返回promise实例时因为符合async的写法
    return new Promise((resolve, reject) => {
        // 执行Generator函数返回遍历器
        let gen = genF();
        //自动执行器
        function next(traFn) {
            let obj;
            try {
                obj = traFn();//在执行yield后面的表达式出错时终止函数并返回失败状态以便函数外部监听
            }catch (e) {
                return reject(e)
            }
            if(obj.done) return resolve(obj.value);//遍历器执行结束时返回结果
            Promise.resolve(obj.value).then(val => next(() => gen.next(val)))//将所有表达式转换为promise等表达式结果返回以后再执行下一次遍历
        }
        //参数为函数的原因是为了在执行表达式时能捕获错误
        next(() => gen.next())
    })
}
function* gen() {
    const data1 = yield function () {
        return 6
    }
    console.log(data1())
    const data2 = yield new Promise(res => {
        setTimeout(() => {
            res(7)
        }, 2000)
    })
    console.log(data2)
    return 9
}
fn().then(console.log)


/*--------------------------------异步Generator 函数----------------------------------------*/
async function* example() {
    yield 'a';
    yield 'b';
    yield 'c';
}
let asyncExample = example();
asyncExample[Symbol.asyncIterator]() === asyncExample
// 异步执行完异步Generator函数并收集返回值
async function takeAsync(asyncIterable) {
    const result = [];
    while (true) {
        const {value, done} = await asyncIterable.next();
        if(done) break;
        result.push(value);
    }
    return result;
}
takeAsync(asyncExample).then(console.log)











