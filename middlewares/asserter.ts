/**
 * 라우터 핸들러 실행전에 권한을 확인하는 [Express.js의 Router-level middleware](http://expressjs.com/en/guide/using-middleware.html)
 * @author 
 */

import {NextFunction, Request, Response} from 'express'

import logManager from '../lib/logManager'
import User from '../models/user'

const logger = logManager(module);

// 사용자 - 로그인 확인 요청
export async function isUser(req: Request, res: Response, next: NextFunction) {
	logger.debug('사용자 - 로그인 확인 요청');

	try {
		if (!req.session!.email) return res.redirect('/user');

		const user = await User.findOne({
			where: {email: req.session!.email},
			attributes: ['email']
		});

		if (user != null) return next();
		return res.redirect('/user');
	}
	catch (err) {
		logger.error('사용자 로그인 요청 처리 실패', err.stack);
		return res.redirect('/user');
	}
}