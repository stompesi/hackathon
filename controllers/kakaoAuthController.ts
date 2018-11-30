/**
 * 카카오톡 로그인 관련 라우터
 *
 * @author stompesi
 */

import * as express from 'express'
import {Request, Response} from 'express'
import * as passport from 'passport'
import * as kakao from 'passport-kakao'

import logManager from '../lib/logManager'

import User from '../models/user'


const logger = logManager(module);

const router = express.Router();
export default router;

const authKaKao = require('../config/config.json').auth.kakao;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(new kakao.Strategy({
	clientID: authKaKao.clientId,
	callbackURL: '/auth/login/kakao/callback',
	clientSecret: ''
}, (accessToken, refreshToken, profile, done) => done(null, profile._json)));


// 사용자 - 카카오 로그인 요청
router.get('/user/login', passport.authenticate('kakao', {
	state: 'user'
}));

interface KakaoInfo {
	kakaoId: string,
	email: string
}

// 사용자, 상점주 - 카카오 로그인 callback 처리
router.get('/auth/login/kakao/callback',
	passport.authenticate('kakao', {failureRedirect: '/'}),
	async (req: Request, res: Response) => {
		if (req.session == undefined) {
			logger.error('사용자 - 카카오 로그인 요청처리 실패 - session is empty');
			return res.redirect('/user');
		}

		const clientInfo: KakaoInfo = {
			kakaoId: req.session.passport.user.id,
			email: req.session.passport.user.kaccount_email
		};

		console.log("clientInfo", clientInfo);
		
		if (req.query.state === 'user') { // 사용자 카카오톡 로그인 처리
			try {
				const user = await User.findOne({
					where: {kakaoId: clientInfo.kakaoId},
					attributes: ['email']
				});

				if (user == null) {
					await User.create(clientInfo);
				}

				// save session info
				req.session.email = clientInfo.email;

				return res.redirect('/user/main');
			}
			catch (err) {
				logger.error('사용자 - 카카오 로그인 요청처리 실패', err.stack);
				return res.redirect('/user');
			}
		} else {
			logger.error(`카카오톡 로그인 실패 - unknown role: ${req.query.state}`);
			return res.redirect('/');
		}
	});
