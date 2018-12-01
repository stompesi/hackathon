/**
 * `/user`로 시작하는 페이지들의 라우터.
 * 사용자과 관련된 페이지 렌더링
 *
 * @author stompesi
 */

import * as express from 'express'
import {isImformation} from '../middlewares/asserter'
import {isVendor} from '../middlewares/asserter'
import {wrapGenerator} from '../middlewares/asyncWrapper'

import Imformation from '../models/cago'
import Vendor from '../models/vendor'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('배차 - 초기 화면 요청', async (req, res) => {
		res.render('cago/index.ejs');
	}));

router.get('/result',
	wrap('배차 - 완료 화면 요청', async (req, res) => {
		res.render('cago/result.ejs');
	}));

router.get('/create', isVendor,
	wrap('배차 - 등록 화면 요청', async (req, res) => {
		res.render('cago/create.ejs');
	}));

router.get('/logout', isVendor,
	wrap('기업 - 로그아웃 요청', async (req, res) => {
		req.session!.destroy((err: any) => {
			if (err) throw err;
		});

		req.logout();
		res.redirect('/vendor');
	}));