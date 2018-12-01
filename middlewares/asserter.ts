/**
 * 라우터 핸들러 실행전에 권한을 확인하는 [Express.js의 Router-level middleware](http://expressjs.com/en/guide/using-middleware.html)
 * @author 
 */

import {NextFunction, Request, Response} from 'express'

import logManager from '../lib/logManager'
import Driver from '../models/driver'

const logger = logManager(module);

// 사용자 - 로그인 확인 요청
export async function isDriver(req: Request, res: Response, next: NextFunction) {
	logger.debug('사용자 - 로그인 확인 요청');

	try {
		if (!req.session!.kakaoId) return res.redirect('/driver');

		const driver = await Driver.findOne({
			where: {kakaoId: req.session!.kakaoId},
			attributes: ['kakaoId']
		});

		if (driver != null) return next();
		return res.redirect('/driver');
	}
	catch (err) {
		logger.error('사용자 로그인 요청 처리 실패', err.stack);
		return res.redirect('/driver');
	}
}