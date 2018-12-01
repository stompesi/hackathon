/**
 * `/user`로 시작하는 페이지들의 라우터.
 * 사용자과 관련된 페이지 렌더링
 *
 * @author stompesi
 */

import * as express from 'express'
import {isVendor} from '../middlewares/asserter'
import {wrapGenerator} from '../middlewares/asyncWrapper'

import User from '../models/vendor'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('사용자 - 초기 화면 요청', async (req, res) => {
		const user = await User.findOne({
			where: {id: req.session!.id},
			attributes: ['ID']
		});

		if (user != null) {
			return res.render('vendor/main.ejs');
		}

		res.render('vendor/index.ejs');
	}));


// router.get('/terms/privacy', isVendor,
//	wrap('사용자 - 개인정보 처리 방침 페이지 요청', async (req, res) => res.render('user/member/terms/privacy.ejs')));



// router.get('/notification/setting', isVendor,
// 	wrap('사용자 - 알림 설정 페이지 요청', async (req, res) => {
// 		const user = await User.findById(req.session!.hexId) as User;

// 		res.render('user/member/notification/index.ejs', {
// 			userInfo: req.session,
// 			isPaymentNoti: user.isPaymentNoti,
// 			isReviewNoti: user.isReviewNoti,
// 			isGiftNoti: user.isGiftNoti
// 		})
// 	}));


router.get('/main', isVendor,
	wrap('사용자 - 메인 페이지 요청', async (req, res) => {
		const renderData = {

		};

		res.render('vendor/main.ejs', renderData);
	}));

router.get('/logout', isVendor,
	wrap('사용자 - 로그아웃 요청', async (req, res) => {
		req.session!.destroy((err: any) => {
			if (err) throw err;
		});

		req.logout();
		res.redirect('/vendor');
	}));