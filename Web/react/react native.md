# React hooks
- state
  - 状态是镜像：保存两次渲染的状态；setter函数更新状态并触发组件再次渲染。
  状态更新操作队列，**使用更新函数**可以解决状态每次传入的是镜像的问题，更新函数会告诉React需要对state做一些处理，而不只是替换state。
    - React会将替换值和更新函数推入更新函数队列。
    - 在下一次render时，会依次执行队列，更新函数的传入值是队列上一个结果（替换值/更新函数返回值）。因此，如果更新函数之前，setter函数传入参数是值，会将值推入队列，作为下一次更新函数的传入值。
    - updater函数必须是纯函数。React在严格模式下，会执行两次，并丢弃第二次的结果，从而帮助发现代码问题。
  - 多次调用setter函数，传入的状态是镜像，并且React会等到event handle中的所有代码执行完毕才会处理状态更新。React不会跨主动触发的事件批量更新。
  - 原理
    - 为每个组件维护一个状态对的数组
    - hooks顶层调用确保useState调用顺序和hooks数组索引一致
  ```js
  let componentHooks = [] //为每个组件维护一个状态对的数组
  let currentHookIndex = 0

  function useState(initialState) {
    let pair = componentHooks[currentHookIndex]
    if (pair) {
      currentHookIndex++
      return pair
    }
    pair = [initialState, setState]

    function setState(nextState) {
      pair[0] = nextState
      updateDOM()
    }

    componentHooks[currentHookIndex] = pair
    currentHookIndex++
    return pair
  }

  function updateDOM() {
    // 更新当前HookIndex
    currentHookIndex = 0

    // 将组件对象的最新状态更新到页面
    renderDOM()
  }
  ```
  - state是组件私有的！！！
  - React维护**UI树中对应位置**的组件的状态，react会保留UI树中相同位置的组件的状态（不是JSX相同代码位置）。注意，不要在组件中定义组件，要在顶层定义组件。
  - 相同UI树位置的组件，需要重置状态的方式是加一个key。key不是全局唯一，只是在父组件内唯一。
  - useReducer的实现原理
    ```js
    import { useState } from 'react';

    export function useReducer(reducer, initialState) {
      const [state, setState] = useState(initialState);

      // 透传dispatch方法，供组件延迟调用
      const dispatch = (action) => {
        setState(reducer(state, action))
      }
      return [state, dispatch];
    }
    ```
  


- hooks是一类特殊的函数，只能在组件顶层或自定义hooks中调用。不能在**分支条件/循环体/内嵌函数**调用hooks。
- 更新数组或对象
更新对象不能直接改变对象，需要浅拷贝到一个新对象。
为什么不能mutate一个对象
  - 优化：React渲染优化会比较preObj === Obj
  - React是基于状态镜像渲染

- 响应事件
事件处理函数通常是：
  - 在组件内部定义
  - 以handle开始的命名（handle+事件名）
  - 事件处理props应该以on开头命名
- 状态变量在一次render中不会改变，即便事件处理的函数是异步的。

- render以及commit
  React render的过程实际上是计算component的改变。
  React只会在两次render发生改变时改变DOM节点。
- Reducer和Context结合起来，扩展应用
  context主要用来消除跨层级透传props值，reducer用来统一处理对同一state的不同操作(思想原自map-reduce的思想)。
  Reducer和Context结合起来，用来实现跨层级传递state和dispatch。通常是全局共享的状态。
  通常实现一个StateContextProvider组件。该组件包括，stateContext, dispatchContext, stateReducer的实现。并对外提供对应的useContext的包装函数（自己实现的Hook，以use开头的函数）。这样处理，逻辑会比较集中。
  ```js
  import { createContext, useContext, useReducer } from 'react';

  const TasksContext = createContext(null);

  const TasksDispatchContext = createContext(null);

  export function TasksProvider({ children }) {
    const [tasks, dispatch] = useReducer(
      tasksReducer,
      initialTasks
    );

    return (
      <TasksContext.Provider value={tasks}>
        <TasksDispatchContext.Provider value={dispatch}>
          {children}
        </TasksDispatchContext.Provider>
      </TasksContext.Provider>
    );
  }

  export function useTasks() {
    return useContext(TasksContext);
  }

  export function useTasksDispatch() {
    return useContext(TasksDispatchContext);
  }

  function tasksReducer(tasks, action) {
    switch (action.type) {
      case 'added': {
        return [...tasks, {
          id: action.id,
          text: action.text,
          done: false
        }];
      }
      case 'changed': {
        return tasks.map(t => {
          if (t.id === action.task.id) {
            return action.task;
          } else {
            return t;
          }
        });
      }
      case 'deleted': {
        return tasks.filter(t => t.id !== action.id);
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

  const initialTasks = [
    { id: 0, text: 'Philosopher’s Path', done: true },
    { id: 1, text: 'Visit the temple', done: false },
    { id: 2, text: 'Drink matcha', done: false }
  ];

  ```
- 自己实现hooks
- ref: 用来存储React不需要跟踪（不影响页面渲染）的值(组件的本地变量)，例如timoutIDs, DOM element。ref的值由react维护，但ref更新不会导致rerender。自定义的组件上设置ref无效（ref为null），因为react不允许一个组件访问其他组件（包括其子组件）。但react支持通过forwardRef传递ref到其子组件。
```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```
在设计系统中，对于按钮、输入框等原子组件这是一种通常的模式来传递其ref。但是对于像form，list, page等高阶组件不会暴漏ref，以免造成对DOM结构对滥用。
如果希望限制ref暴漏的方法，可以使用useImperativeHandle:
```js
import {
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react'

const MyInput = forwardRef((props, ref) => {
  const realRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() {
      realRef.current.focus();
    }
  }))
  return <input {...props} ref={realRef}>
})
```
- 立即更新dom的方式
```js
flushSync(() => {
  setTodos([...todos, newTodo]);
})
```
- effects: 和外部系统同步状态。通常是网络请求或调用第三方。
  - 通常在react组件中有两种逻辑：
    - rendering code。包含：props, state, 转换函数，以及返回一个JSX。应该是一个纯函数。
    - event handler。包含副作用。通常由用户触发。
  - effects提供渲染过程中提供副作用的方式。effect是响应式的方式
  - 执行时机是当页面更新渲染commit的最后。
  - 怎么使用effect。
    - 声明一个effect，effect会在每次render之后。
    - 添加effect的依赖项（这些依赖项必须是响应式的值，即component中定义的state，props，function）。大部分的effect只需要在特殊情况下执行，而不是每次渲染都执行。注意：1. 不要在effect里面setState依赖项，会造成死循环。2. 没有依赖(每次渲染都会执行)和依赖项空数组（只会在组件mount的时候执行）的情况不同。3. 注意依赖项是否会发生改变。不发生改变的依赖项如ref可以去掉。
    - 必要时增加cleanup逻辑。就是在effect的回调里返回一个cleanup函数。cleanup函数会在再次调用effect回调之前，以及unmount的时候被调用。
    - **race condition**: effect处理请求的状态紊乱问题，可以有两种方式解决：用ignore标志维护请求是否忽略；使用abortController API。
  - 什么时候不需要使用useEffect。1. 计算属性(应该用local variable)；2. 缓存计算结果（应该使用**useMemo**）；3.state变换重置组件所有状态(使用key，key值为观察的状态)；4. 根据props变化更新其他state值（useEffect执行时机在render之后，react在每次render时，发现有更新state会放弃后续的渲染，而是重新开始新的一轮render，因此，如果render过程中有setState，需要加一些条件避免发生死循环）。尽量使用key或者计算属性。5. 一些逻辑发生在用户看到组件的时候，应该将逻辑放入effect。
  - 订阅外部存储值变化。使用useSyncExternalStore。useSyncExternalStore(subscribeFunc, getValCallback)
  - fetching data逻辑封装成一个hook。**注意需要清理函数处理ignore值**
    ```js
    // fetch data
    function useData(url) {
      const [data, setData] = useState(null)
      useEffect(() => {
        let ignore = false;
        url && fetch(url).then(response => response.json())
        .then(json => {
          if(!ignore) {
            setData(json);
          }
        })
        return () => {
          ignore = true;
        }
      }, [url])
      return data
    }
    // use select options
    import { useState, useEffect } from 'react'
    import { fetchData } from './api.js'

    export function useSelectOptions(url) {
      const [list, setList] = useState([])
      const [selectedId, setSelectedId] = useState('')

      useEffect(() => {
        let ignore = false
        url && fetchData(url).then(result => {
          if (!ignore) {
            setList(result)
            setSelectedId(result[0])
          }
        })
        return () => {
          ignore = true
        }
      }, [url])
      return [list, selectedId, setSelectedId]
    }
    ```
- 将非响应式的部分抽离到试验性的api-useEffectEvent。
- 自定义hook
  - 不同组件中共享逻辑
  - 随着时间的推移，代码中大部分的effect都会在自定义hook中。
  - 自定义的hook命名需要更具体。

  

- useMemo: useMemo(callback, [...dependencies])，返回缓存数据，在下一次渲染的时候，会判断dependencies是否发生改变，只会在dependencies发生改变时触发重新计算。



# React MVVM核心逻辑

