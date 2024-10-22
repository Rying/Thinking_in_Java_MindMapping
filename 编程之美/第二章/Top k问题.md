# 问题：
 >> 有很多个无序的数，怎么选出其中最大的若干个数？

## 排序算法
｜ 算法 ｜ 描述 ｜ 时间复杂度 ｜ 空间复杂度 ｜ 稳定性 ｜
｜ ---- | ---- | -----| ---- | ---- |
| 冒泡排序 | 每次遍历，比较相邻两个元素，如果不满足排序要求，交换位置，每一轮遍历结束，会有一个元素被交换到有序位置 | 带是否有序标识的遍历，最差情况下的时间复杂度是O(n^2) | O(1) | 稳定 ｜
｜ 选择排序 ｜ 每次遍历，从非有序区选择最大/最小的元素追加到有序区末尾 | O(n^2) | O(1) | 非稳定 |
｜ 快速排序 ｜ 每次遍历，将待排数据分作两组，其中一组的任何一个数都比另一组的任何一个大 | O(nlogn) | O(1) | 非稳定 |
| 堆排序 | 每次取出（删除）堆顶元素的操作 | O(nlogn)| O(1) | 非稳定 | 

### 冒泡排序
遍历初始条件：外层循环，有序索引。从前往后遍历，则有序位置从后往前
   转换条件：if (!compareCondition) {swap}
   终止条件：循环结束 ｜ 已有序
```js
function bubbleSort(arr, compareFunc = (x, y) => ((x - y) > 0)) {
  for (let i = 0; i < arr.length; i++) {
    let sorted = true
    for (let j = 0; j < arr.length - i; j++) {
      console.log(arr[j], arr[j+1])
      if (compareFunc(arr[j], arr[j+1])) {
        const temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
        sorted = false
      }
    }
    if (sorted) {
      return arr
    }
  }
  return arr
}
```
### 选择排序
遍历初始条件：外层循环，i从0开始，到length-1
            内层循环，j从外层循环下一个位置开始i+1，到length
            targetIndex = i
   转换条件：if (compareFunc(arr[j]), arr[targetIndex]) {
              targetIndex = j
            }
内层循环结束：swap(i, targetIndex)

```js
function selectionSort(arr, compareFunc = (x, y) => ((x - y) > 0)) {
  for(let i = 0; i < arr.length - 1; i++) {
    let targetIndex = i
    for (let j = i+1; j < arr.length; j++) {
      if(compareFunc(arr[j], arr[targetIndex])) {
        targetIndex = j
      }
    }
    if (targetIndex !== i) {
      const temp = arr[i]
      arr[i] = arr[targetIndex]
      arr[targetIndex] = temp
    }
  }
  return arr
}
```
### 快速排序
快速排序：
quick_sort(p...r) = quick_sort(p...q-1) + quick_sort(q+1...r)
每一次遍历，在集合中找一个pivot用来比较，比pivot小的部分放一边，比pivot大的部分放一边
快排的原地算法思想
- 用一个游标记录分界点，左边部分比pivot小，游标以及右边部分比pivot大
- 从前往后遍历，如果数值小于pivot，就将该值与游标处交换，游标向前移动一位
```js
// 原地排序
function partition(arr, begin, end) {
  const pivot = arr[end]
  // partionIndex记录比pivot小的区域的末尾index
  let partionIndex = begin
  for (let i = begin ; i < end ;i++) {
    if (arr[i] < pivot) {
      const temp = arr[partionIndex]
      arr[partionIndex] = arr[i]
      arr[i] = temp
      partionIndex++
    }
  }
  const temp = arr[partionIndex]
  arr[partionIndex] = pivot
  arr[end] = temp
  return partionIndex
}

// 尾调用处理
function quickSort(arr, begin, end) {
  if (begin >= end) return arr

  const partion = partion(arr, begin, end)
  return quickSort(quickSort(arr, begin, partion - 1), partion + 1, end)
}
```
### 堆排序
堆的数据结构：
- 完全二叉树：除了最后一层，其他层节点个数都是满的，最后一层的节点都靠左排列（比较适合用数组来存储）
- 堆中每一个节点的值都必须大于等于（小于等于）其子树中每个节点的值
堆化：顺着节点所在的路径，向上或向下对比，然后交换。
堆的操作
```js
function swap(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
// 数据结构
class Heap {
  private _elements
  private _size
  private _count

  // 从下至上，顺着节点所在的路径比较，然后交换。
  insert(data) {
    if (this._count >= this._size) return
    this._count++
    this._elements.push(data)
    let i = this._count
    while((i >> 1) > 0 && this._elements[i] > this._elements[(i >> 1)]) {
      swap(this._elements, i, i >> 1)
      i = i >> 1
    }
  }
  // 删除堆顶元素，为防止空洞，将最后一个节点移到堆顶，然后从上至下，顺着节点所在的路径比较交换
  /**
   * 遍历路径的时候，一定要注意判断是否超出数组范围
  */
  removeMax() {
    if (this._count === 0) return
    if (this._count === 1) {
      this._elements.pop()
      this._count++
      return
    }
    this._elements[0] = this._elements[this._count - 1]
    this._elements.pop()
    let i = 0
    while(((i<<1) + 1) < this._count) {
      let maxChildIndex = (i<<1) + 1
      if (((i<<1) + 2) < this._count && this._elements[(i<<1) + 1] < this._elements[(i<<1) + 2]) {
        maxChildIndex = (i<<1) + 2
      }
      if (this._elements[maxChildIndex] > this._elements[i]) {
        swap(this._elements, i, maxChildIndex)
        i = maxChildIndex
      }
    }
  }
}
```
## 问题分析

- 在K（K＜＝log2 N）较小的情况下，可以选择部分排序
- 快速排序。假设N个数存储在数组S中，我们从数组S中随机找出一个元素X，把数组分为两部分Sa和Sb 。Sa 中的元素大于等于X，Sb 中元素小于X。[Sa, Sb 中最大的K－|Sa |个元素]
```js
// 伪代码
kbig(s, k):
  if (k <= 0) return []
  if (s.length <=k) return s
  (sa, sb) = partition(s, k)
  return kbig(sa, k).append(sb, k - sa.length)
```
- 二分查找第k大数（O(nlogn)），然后遍历返回大于等于第k大数（O(n)）
- 堆排序，维护大小为k的最小堆，遍历n - k个数，比较堆顶，如果大于堆顶元素，替换堆顶并进行堆化(O(logn))，因此整体的时间复杂度是（O(nlogn)）。当n的数量级很大，存储空间有限的情况下用堆排序比较合理。
