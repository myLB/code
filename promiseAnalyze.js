/*let obj1 = new Promise(res => {})
let obj2 = new Promise((res) => {
    res(obj1)
}).then(console.log).catch(console.log)*/
/*
先执行obj1,但没有表明状态,所以什么也不做。然后执行obj2,obj2中resolve的参数是obj1,那么也就是说要等obj1表明状态才会执行后面的。
这个时候会执行promise.js中的95行代码,然后将obj2中then函数新建的obj3、参数放入obj2的回调函数集合中.然后在catch中新建的obj4,
将obj4和参数放入obj3的回调函数集合中。这样当obj1状态改变时,比如res(2),其会去执行obj2的resolve函数,参数为2,从而改变obj2的状态和结果,
然后依次执行。如果是rej(3),其会去执行obj2的reject函数,参数为3,从而改变obj2的状态和结果,最后执行catch中的回调
*/