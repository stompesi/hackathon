import * as crypto from 'crypto'
import stringHash = require('string-hash');

/**
 *
 *
 * @param password - Hash값을 만들고 싶은 비밀번호
 * @returns SHA256 hash value
 * @author stompesi
 */
export function generatePasswordHash(password: string): string {
	return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * 같은 `id`에대해 매일 (UTC 0 기준) 다른 hash값을 생성
 *
 * @param id - daily hash값을 만들고 싶은 아무 id
 * @returns 32-bit integer hash
 * @author 
 */
export function genDailyHash(id: string): number {
	const date = Math.ceil(Date.now() / (24 * 60 * 60 * 1000));
	return stringHash(`${date}${id}`);
}