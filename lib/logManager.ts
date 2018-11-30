/**
 * 모듈에 맞는 로그 객체를 만들어주는 모듈
 */

import * as fs from 'fs'
import * as path from 'path'
import * as winston from 'winston'
import {TransportInstance} from 'winston'

const config = require('winston-console-formatter');

/**
 * 모듈의 절대주소에서 최말단 2단계 주소를 추출
 *
 * @param module - Node.js의 모듈 객제
 * @returns 모듈 이름
 * @author stompesi
 */
function getLabel(module: NodeJS.Module) {
	const parts = module.filename.split('/');
	return parts[parts.length - 2] + '/' + parts.pop();
}

/**
 * 로그 파일들의 저장 위치
 */
export const logPath = path.join(__dirname, '..', 'logs');


/**
 * 해당 모듈의 이름을 라벨로 가지는 {@link winston} 로깅 객체를 생성
 *
 * @remarks
 * 프로세스의 environment에 `SYSTEMD`가 있다면 콘솔에 출력하지 않는다.
 *
 * @param module - Node.js의 모듈 객체
 * @param logLevel - `info`, `debug`, `error`등 로깅 할 최소레벨 설정. (기본값: `info`)
 * @returns {@link winston} 로깅 객체
 * @author stompesi
 */
export default function (module: NodeJS.Module, logLevel: string = 'info') {
	if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

	const label = getLabel(module);
	const {formatter, timestamp}: { formatter: (options?: any) => string, timestamp: () => string } = config();

	const transports: TransportInstance[] = [
		new winston.transports.File({
			formatter,
			timestamp,
			filename: path.join(logPath, 'log.log'),
			maxsize: 1048576,
			zippedArchive: true,
			json: false,
			label
		})
	];

	if (process.env.SYSTEMD !== 'true') {
		transports.push(new winston.transports.Console({
			formatter,
			timestamp,
			json: false,
			label
		}));
	}

	return new winston.Logger({
		level: logLevel,
		transports: transports
	});
};