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

import Driver from '../models/driver'


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
router.get('/driver/login', passport.authenticate('kakao', {
	state: 'driver'
}));

interface KakaoInfo {
	kakaoId: string
}

// 사용자, 상점주 - 카카오 로그인 callback 처리
router.get('/auth/login/kakao/callback',
	passport.authenticate('kakao', {failureRedirect: '/'}),
	async (req: Request, res: Response) => {
		if (req.session == undefined) {
			logger.error('사용자 - 카카오 로그인 요청처리 실패 - session is empty');
			return res.redirect('/driver');
		}

		const clientInfo: KakaoInfo = {
			kakaoId: req.session.passport.user.id
		};

		console.log("clientInfo", clientInfo);
		
		if (req.query.state === 'driver') { // 사용자 카카오톡 로그인 처리
			try {
				const driver = await Driver.findOne({
					where: {kakaoId: clientInfo.kakaoId},
					attributes: ['kakaoId', 'license']
				});

				if (driver == null) {
					const renderData = {
						kakaoId: clientInfo.kakaoId
					};
					
					return res.render('driver/join', renderData);
				}

				// save session info
				req.session.kakaoId = driver.kakaoId;
				req.session.driverId = driver.license;

				return res.redirect('/driver/main');
			}
			catch (err) {
				logger.error('사용자 - 카카오 로그인 요청처리 실패', err.stack);
				return res.redirect('/driver');
			}
		} else {
			logger.error(`카카오톡 로그인 실패 - unknown role: ${req.query.state}`);
			return res.redirect('/');
		}
	});
