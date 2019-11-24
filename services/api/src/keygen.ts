/**
 * Generate random alphanumeric strings
 */

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const base36digits = '01234567890abcdefghijklmnopqrstuvwxyz'.split('');

export function base36(length=16) {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += base36digits[random(0, base36digits.length-1)]
    }
    return str;
}