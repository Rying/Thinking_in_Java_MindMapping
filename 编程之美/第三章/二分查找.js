/**
 * 给定一个有序（不降序）数组arr，求任意一个i使得arr[i]等于v，不存在则返回-1
 * 递归或循环：
 * 二分查找
 * 初始条件：begin = 0, end = size - 1
 * 转换条件：mid = begin + (end - begin) / 2
 *          if (arr[mid] === v) return mid
 *          if (arr[mid] < v) 
 *              begin = mid
 *          else
 *              end = mid - 1
 * 终止条件：begin >= end
 */
function search(arr, val) {
  let min = 0, max = arr.length - 1
  while(min < max) {
    const mid = min + ((max - min) >> 1)
    if (arr[mid] === val) {
      return mid
    }
    if (arr[mid] < val) {
      min = mid + 1
    } else {
      max = mid - 1
    }
  }
  if (arr[min] === val) {
    return min
  }
  if (arr[max] === val) {
    return max
  }
  return -1
}

/**
 * 给定一个有序（不降序）数组arr，求最小的i使得arr[i]等于v，不存在则返回-1
 * 
 * 二分查找
 * 初始条件：begin = 0, end = length - 1
 * 转换条件：mid = begin + Math.floor((end - begin) / 2)
 *          if (arr[mid]<=v) { end = mid } else {begin = mid + 1}
 * 循环条件：begin < end
 */

function search(arr, val) {
  if (!arr.length) return -1

  let min = 0, max = arr.length - 1

  while(min < max) {
    const mid = min + ((max - min) >> 1)
    if (arr[mid] >= val) { // *转换条件
      max = mid
    } else {
      min = mid + 1
    }
  }

  return arr[min] === val ? min : -1
}
/**
 * 反思： 
 * 这种找重复中最小/大的索引的问题，需要注意两点：
 * - 左边界，右边界收敛方向，否则会出现死循环
 * - 转换条件
 *  - 求最小，min = mid + 1, mid = min + Math.floor((max - min) / 2)
 *  - 求最大，max = mid - 1, mid = min + Math.ceil((max - min) / 2)
 */

/**
 * 给定一个有序（不降序）数组arr，求最大的i使得arr[i]等于v，不存在则返回-1
 * 初始条件：begin = 0, end = length - 1
 * 转换条件：
 *          mid = begin + Math.ceil((end - begin) / 2)
 *         if (arr[mid] <= v) {
 *            begin = mid
 *         } else {
 *            end = mid - 1
 *         }
 * 循环条件：begin < end
 */

function search(arr, val) {
  if (!arr.length) return -1
  let min = 0, max = arr.length - 1
  while(min < max) {
    const mid = min + Math.ceil((max - min) / 2)
    if (arr[mid] <= val) {
      min = mid
    } else {
      max = mid - 1
    }
  }
  return arr[max] === val ? max : -1
}

/**
 * 给定一个有序（不降序）数组arr，求最大的i使得arr[i]小于v，不存在则返回-1
 * 该问题可以转换为：给定一个有序（不降序）数组arr，求最小的i使得arr[i]等于v，不存在则返回-1
 * 如果找到最小的i使得arr[i] === v，则i-1就是最大的i
 * 二分查找：
 * 初始条件：begin = 0, end = length - 1
 * 转换条件：mid = begin + (end - begin) / 2
 *          if (arr[mid]>=v) {
 *             end = mid
 *          } else {
 *             begin = mid + 1
 *          }
 * 终止条件：begin < end - 1
 */

function search(arr, val) {
  if (!arr.length || arr[0] === val) return -1
  let min = 0, max = arr.length - 1
  while(min < max - 1) {
    const mid = min + ((max - min) >> 1)
    if (arr[mid] >= val) {
      max = mid
    } else {
      min = mid + 1
    }
  }

  if (arr[min] === val) {
    return min - 1
  }
  if (arr[max] === val) {
    return max - 1
  }
  return -1
}

/**
 * 给定一个有序（不降序）数组arr，求最小的i使得arr[i]大于v，不存在则返回-1
 * 该问题可以转换为：给定一个有序（不降序）数组arr，求最大的i使得arr[i]等于v，不存在则返回-1
 */