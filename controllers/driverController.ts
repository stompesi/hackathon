/**
 * `/driver`로 시작하는 페이지들의 라우터.
 * 사용자과 관련된 페이지 렌더링
 *
 * @author stompesi
 */

import * as express from 'express'
import {isDriver} from '../middlewares/asserter'
import {wrapGenerator} from '../middlewares/asyncWrapper'

import Driver from '../models/driver'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('사용자 - 초기 화면 요청', async (req, res) => {
		const driver = await Driver.findOne({
			where: {kakaoId: req.session!.kakaoId},
			attributes: ['kakaoId']
		});

		if (driver != null) {
			return res.render('driver/main.ejs');
		}

		res.render('driver/index.ejs');
	}));


// router.get('/join', wrap('기사 - 등록', async (req, res) => res.render('driver/join.ejs')));

// router.get('/terms/privacy', isDriver,
//	wrap('사용자 - 개인정보 처리 방침 페이지 요청', async (req, res) => res.render('driver/member/terms/privacy.ejs')));



// router.get('/notification/setting', isDriver,
// 	wrap('사용자 - 알림 설정 페이지 요청', async (req, res) => {
// 		const driver = await Driver.findById(req.session!.hexId) as Driver;

// 		res.render('driver/member/notification/index.ejs', {
// 			driverInfo: req.session,
// 			isPaymentNoti: driver.isPaymentNoti,
// 			isReviewNoti: driver.isReviewNoti,
// 			isGiftNoti: driver.isGiftNoti
// 		})
// 	}));


router.get('/main', isDriver,
	wrap('사용자 - 메인 페이지 요청', async (req, res) => {
		const renderData = {

		};

		res.render('driver/main.ejs', renderData);
	}));

router.get('/logout', isDriver,
	wrap('사용자 - 로그아웃 요청', async (req, res) => {
		req.session!.destroy((err: any) => {
			if (err) throw err;
		});

		req.logout();
		res.redirect('/driver');
	}));
