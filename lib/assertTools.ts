/**
 * 각종 validation에 필요한 함수들
 */
export const REGEX_CELL_PHONE_NUMBER = /^(?:(010\d{4})|(01[1|6-9]\d{3,4}))(\d{4})$/;
export const REGEX_ALL_PHONE_NUMBER = /^((?:(010\d{4})|(01[1|6-9]\d{3,4}))(\d{4}))|((0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]))(\d{3,4})(\d{4}))$/;
export const REGEX_BIRTH_DAY = /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))$/;
export const REGEX_ID = /0x[0-9a-f]+/i;
export const REGEX_DATE = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;

export function isIntArray(v: any) {
	return Array.isArray(v) ? v.every(Number.isSafeInteger) : Number.isSafeInteger(v)
}

export function toIntArray(v: any) {
	return Array.isArray(v) ? v.map(Number.parseInt) : [Number.parseInt(v)]
}