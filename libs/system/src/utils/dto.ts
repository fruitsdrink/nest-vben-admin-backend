export const formatDto = (dto: object) => {
  if (!dto) return dto;
  // 如果不是对象类型，直接返回
  if (typeof dto !== 'object') return dto;

  // 循环遍历dto对象，将字符串类型的值去掉空格，将数字类型的值转换为数字，将布尔类型的值转换为布尔值，将对象类型的值递归调用parseDto函数

  Object.keys(dto).map((key) => {
    const value = dto[key];
    if (typeof value === 'string') {
      dto[key] = value.trim();
    } else if (typeof value === 'number') {
      dto[key] = Number(value);
    } else if (typeof value === 'boolean') {
      dto[key] = Boolean(value);
    } else if (typeof value === 'object') {
      dto[key] = formatDto(value);
    } else {
      dto[key] = value;
    }
  });

  return dto;
};
