// 数 = 符号 * 系数 * (2 ** 指数)
function deconstruct(number) {
  let sign = 1;
  let coefficient = number;
  let exponent = 0;

  if(coefficient < 0) {
    coefficient = -coefficient;
    sign = -1;
  }
  if (Number.isFinite(number) && number !== 0) {
    exponent = -1128; // -1128是MIN_VALUE最小正整数的指数
    let reduction = coefficient;
    // 磨光系数，计算指数
    while(reduction !== 0) {
      exponent += 1;
      reduction /= 2;
    }
    // 磨光指数，计算系数
    reduction = exponent;
    while(reduction > 0) {
      coefficient /= 2;
      reduction -= 1;
    }
    while(reduction < 0) {
      coefficient *= 2;
      reduction += 1;
    }
  }
  return {
    sign,
    coefficient,
    exponent,
    number
  }
}
