const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 校验手机号
const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(phone)) {
    return false;
  }
  return true;
}

// 校验邮箱
const validateEmail = (email) => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!reg.test(email)) {
   return false;
  }
  return true;
}

/**
 * 计算目标日期距离当前日期的剩余天数
 * @param {string} targetDateStr - 目标日期字符串，格式如 "2024-12-21"
 * @returns {number} - 返回剩余天数（向上取整），如果日期已过则返回负数或0
 */
const getRemainingDays = (targetDateStr) => {
  const formattedDate = targetDateStr.replace(/-/g, '/');

  const target = new Date(formattedDate);
  target.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const timeDiff = Math.abs(target.getTime() - now.getTime());

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return days;
}

/**
 * 手机号脱敏
 * @param {string} phone - 需要脱敏的手机号
 * @returns {string} - 返回脱敏后的手机号
 */
const desensitizedPhone = (phone) => {
  const strPhone = String(phone || '').replace(/\s+/g, '');
  if (!/^\d{11}$/.test(strPhone)) {
    return strPhone;
  }
  return strPhone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

module.exports = {
  formatTime,
  validatePhone,
  validateEmail,
  getRemainingDays,
  desensitizedPhone
}
