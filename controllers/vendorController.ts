/**
 * `/user`로 시작하는 페이지들의 라우터.
 * 사용자과 관련된 페이지 렌더링
 *
 * @author stompesi
 */

import * as express from 'express'
import {isVendor} from '../middlewares/asserter'
import {wrapGenerator} from '../middlewares/asyncWrapper'

import Vendor from '../models/vendor'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('벤더 - 초기 화면 요청', async (req, res) => {
		const vendor = await Vendor.findOne({
			where: {id: req.session!.vendorId},
			attributes: ['COMPANNY_NAME'],
			raw: true
		});

		if (vendor != null) {
			return res.render('vendor/main.ejs', {
				compannyName: vendor!.companyName
			});
		}

		res.render('vendor/index.ejs');
	}));

router.get('/join',
	wrap('기업 - 등록 화면 요청', async (req, res) => { res.render('vendor/join.ejs'); }));

router.get('/main', isVendor,
	wrap('기업 - 메인 페이지 요청', async (req, res) => {
		const vendor = await Vendor.findOne({
			where: {id: req.session!.vendorId},
			attributes: ['COMPANNY_NAME'],
			raw: true
		});

		return res.render('vendor/main.ejs', {
			compannyName: vendor!.companyName
		});
	}));

router.get('/logout', isVendor,
	wrap('기업 - 로그아웃 요청', async (req, res) => {
		req.session!.destroy((err: any) => {
			if (err) throw err;
		});

		req.logout();
		res.redirect('/vendor/index.ejs');
	}));