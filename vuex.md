## 注册插件
在`Vue.use`或`new Vuex.Store()`的时候确定`Vue`的版本号和在什么时候绑定到`Vue`实例上,2.0以上的版本是在`beforeCreate`的时候绑定

### 初始化
创建`Store`实例并且对其`options`进行模块化。
```ecmascript 6
    let store = {
        _watcherVM: new Vue(),
        _modules: {
            root: {
                _children: {
                    module1: {
                        _rawModule: {
                           state,
                           getters,
                           mutations,
                           actions,
                           modules 
                        },//options.modules.module1
                        state: options.modules.module1.state,
                        _children: {} //该模块下面的子模块
                    }
                },
                state: options.state,
                _rawModule: options//{state,getters,mutations,actions,modules}
            }
        }
    }
```
### 使用
```ecmascript 6
const store = {
    state: {
        
    },
    mutations: {
        add(){
            
        }
    },
    action: {
       getStoreList ({
            dispatch/*分发当前模块下面的dispatch*/,
            commit/*触发当前模块下面的commit*/,
            getters/*读取当前模块下面的getters*/,
            state/*读取当前模块下面的state*/,
            rootGetters,/*根模块的getter*/
            rootState/*根模块的state*/
       }, data/*传递的参数*/) {
           console.log(data)
       }//组件中使用this.$store.dispatch('getStoreList',9) 
    },
    getter: {
       count(state/*读取当前模块下面的state*/,getters/*读取当前模块下面的getters*/,rootState/*根模块的state*/,rootGetters/*根模块的getter*/){
           
       }//组件中使用this.$store.getter['count'] 
    },
    modules: {
        modules1: {
            namespaced: true,//必须加上不然函数会合并到父模块中
            state: {
                
            },
            mutations: {
                add (state/*读取当前模块下面的state*/,data/*传递的参数*/) {
                    console.log(data.num)
                    //在组件中使用this.$store.commit({type: 'modules1/add',num: 9})
                }
            },
            getter: {
               count(
                   state/*读取当前模块下面的state*/,
                   getters/*读取当前模块下面的getters*/,
                   rootState/*根模块的state*/,
                   rootGetters/*根模块的getter*/
               ){
                   return num => num
               }//组件中使用this.$store.getter['modules1/count'].(2) 
            },
            getStoreList ({
                dispatch/*分发当前模块下面的dispatch*/,
                commit/*触发当前模块下面的commit*/,
                getters/*读取当前模块下面的getters*/,
                state/*读取当前模块下面的state*/,
                rootGetters,/*根模块的getter*/
                rootState/*根模块的state*/
            }, data/*传递的参数*/) {
                commit('add', 5)//调用当前模块的
                dispatch('getStoreList', 6)//调用当前模块的
                commit({
                    type: 'add',
                    root: true,
                    num: 5 
                })//调用根模块的
                commit({
                    type: 'getStoreList',
                    root: true,
                    num: 5 
                })//调用根模块的或其他模块的(通过type决定调用哪个模块的)
                console.log(data)
                //组件中使用this.$store.dispatch('modules1/getStoreList',9) 
                //this.$store.dispatch({type: 'modules1/getStoreList',num: 9})
            }
        }
    }
}
```
### 直接在组件上映射使用
#### state
```ecmascript 6
let computed = {...mapState(['module1/count'])}
//或者
let computed = {...mapState('module1',['count'])}
//或者对state属性重命名
let computed = {...mapState('module1',{
    re
})}
```
为什么不放在`data`而是在`computed`中？
因为如果放在`data`中必要烦,必须要写`count()`

#### getter
```ecmascript 6
let computed = {...mapGetters(['module1/count'])}
//或者
let computed = {...mapGetters('module1',['count'])}
//或者对state属性重命名
let computed = {...mapState('module1',{num: 'count'})}
```
#### mutations
```ecmascript 6
let methods = {...mapMutations(['module1/add'])}
//或者
let methods = {...mapMutations('module1',['add'])}
//或者对state属性重命名
let methods = {...mapMutations('module1',{
    num ([commit,...arg]) {
       //需要手动去commit 
       commit('add',arg)
    }//在组件中运用: num(2)
})}
```
#### actions
```ecmascript 6
let methods = {...mapActions(['module1/getData'])}
//或者
let methods = {...mapActions('module1',['getData'])}
//或者对state属性重命名
let methods = {...mapActions('module1',{
    getList ([dispatch,...arg]) {
       //需要手动去dispatch
       dispatch('getData',arg)
    }//在组件中运用: getList(2)
})}
```
#### createNamespacedHelpers
该函数用于指定`mapState`、`mapGetters`、`mapMutations`、`mapActions`所要映射的属性的模块名

#### state和getter
在`store`中有一个`_vm`属性,其是一个`Vue`实例,其中`store`中的`state`和`getter`属性分别作为实例的`data`和`computed`的数据,
所以只要在组件中读取`store`的这两个属性,其实就是读取`Vue`实例的`data`和`computed`中的数据。

#### store.watch
```ecmascript 6
this.$store.watch((state,getters) => {},{
    handler (newVal, oldVal) {
        
    },//watcher实例订阅的数据变化时的回调函数
    user: true,//内部定义表示使用者创建的,需要检测其错误信息
    deep: true,//深度收集watcher实例
    immediate: true,//表示创建watcher实例后立马执行
})
```
该`api`的作用是监听`state`或`getters`中某个数据的变化

#### store.replaceState
将`store._vm`中的`_data.$$state`数据替换

#### store.subscribe
```ecmascript 6
this.$store.subscribe(({type, payload}, state) => {
    //type: 当前commit的mutations中的函数
    //payload: 当前commit的mutations中的函数传递的参数
    //state: store.state
})
```
该函数的作用是监听当前`commit`的是`mutations`中的哪个函数,一般用于插件。其返回一个函数,
执行后清除监听

#### store._actionSubscribers
```ecmascript 6
this.$store.actionSubscribers({
    before ({type, payload}, state) {},
    after ({type, payload}, state) {}
    //type: 当前dispatch的actions中的函数
    //payload: 当前dispatch的actions中的函数传递的参数
    //state: store.state
})
```
该函数的作用是监听当前`dispatch`的是`actions`中的哪个函数,一般用于插件。其返回一个函数,
执行后清除监听

#### store.registerModule(最好不要创建同名的模块,因为删除该模块的时候会将原有模块的东西也删除)
```ecmascript 6
this.$store.registerModule(['module1'],{state,actions,mutations,getters}, {
  preserveState: true,
  //表示是否要在根state中保存该模块的state: true不保存 false保存  
})
```
动态创建一个模块,当然只能是子模块,如果与原模块各项属性冲突则是替换,其中在根`state`中该模块
的原`state`是否保存由`preserveState`决定,`true`表示保存,`false`表示替换。相当于重新合并
为一个新的模块。

   - state不合并只替换
   - mutations合并
   - actions合并
   - getters合并,如果属性名相同则替换

### store.registerModule
将动态生成的模块全部删除,包括原模块的东西以及`state`数据


#### strict
使 `Vuex store` 进入严格模式，在严格模式下，任何 `mutation` 处理函数以外修改 `Vuex state` 都会抛出错误。

#### hotUpdate
```ecmascript 6
this.$store.hotUpdate({
    const newMutations = require('./mutations').default;
    const newModuleA = require('./modules/a').default;
    mutations: newMutations,
    modules: {
        a: newModuleA
    }
})
```
类似于`webpack`的热更新,当修改文件时能更新`store`实例


#### plugins
这个选项用于`store`的一些操作,其是一个数组并且包含的项为函数,这个函数由插件创建
者定义,参数为`store`也就是`store`实例,所以函数内部可以调用`store`一切`api`

```ecmascript 6
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```









