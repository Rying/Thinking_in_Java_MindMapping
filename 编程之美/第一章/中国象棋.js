/** 中国象棋中的将和帅（这里用A，B表示），A不能面对B。
 * 请输出一个程序，输出A和B的所有合法位置。要求在代码中只能使用一个变量。
 * 
 * 分析：
 * 为了能够进行判断，首先需要创建一个逻辑的坐标系统，这里用1-9数字，按照行优先的顺序来表示每个格点的位置
 * 这样，只需要用模余运算就可以得到当前的列号，从而判断A，B是否互斥。
 * 方案一：用一个8位的二进制串表示A，B的位置信息。4位表示的数的范围是0-15，足以覆盖1-9数字，遍历A和B的所有可能的排列组合，输出合法的输出
 * */

const getPossiblePlace = () => {
  const HALF_BITS_LENGTH = 4
  const LMASK = 0b11110000
  const RMASK = 0b00001111
  // 将b的右边设置为n
  const rSet = (b, n) => ((LMASK & b) | n)
  // 将b的左边设置为n
  const lSet = (b, n) => ((RMASK & b) | (n << HALF_BITS_LENGTH))
  // 得到b的右边的值
  const rGet = (b) => RMASK & b
  // 得到b的左边的值
  const lGet = (b) => (LMASK & b) >> HALF_BITS_LENGTH

  const grid = 3

  let b = 0b00000000
  for (b = lSet(b, 1); lGet(b) <= grid * grid; b = lSet(b, lGet(b) + 1)) {
    for (b = rSet(b, 1); rGet(b) <= grid * grid; b = rSet(b, rGet(b) + 1)) {
      if (lGet(b) % grid !== rGet(b) % grid) {
        console.log(lGet(b), rGet(b))
      }
    }
  }
}

/**
 * 方案二：
 * 基于方案一的双层for循环打平，外层循环的步长是9，内层循环的步长是1，循环81次
 */

const getPossiblePlace1 = () => {
  let i = 81
  while (i--) {
    // i / 9对应外层循环变量
    // i % 9对应内层循环变量
    if (Math.floor(i / 9) % 3 !== i % 9 % 3) {
      console.log(Math.floor(i / 9) + 1, i % 9 + 1)
    }
  }
}