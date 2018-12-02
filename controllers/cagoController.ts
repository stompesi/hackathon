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
import Cago from '../models/cago'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('배차 - 초기 화면 요청', async (req, res) => {
		res.render('cago/index.ejs');
	}));

router.get('/create', isVendor,
	wrap('배차 - 등록 화면 요청', async (req, res) => {
		res.render('cago/create.ejs');
	}));

router.get('/result',
	wrap('배차 - 완료 화면 요청', async (req, res) => {
		res.render('cago/result.ejs');
	}));

router.get('/list/vendor', isVendor,
	wrap('배차 - 등록 화면 요청', async (req, res) => {
		const cagos = await Cago.findAll({
			where: {vendorId: req.session!.vendorId}
		})

		console.log(cagos);
		
		res.render('cago/list.ejs', {
			cagos: cagos
		});
	}));

router.get('/vendor/:cagoId', isVendor,
	wrap('배차 - 등록 화면 요청', async (req, res) => {
		res.render('cago/test.ejs');
	}));	

router.get('/complete/:cagoSeq', isVendor,
	wrap('배차 - 등록 화면 요청', async (req, res) => {
		const cagoSeq = req.query.cagoSeq;

		const cago = await Cago.findOne({
			where: {seq: cagoSeq}
		})
		
		res.render('cago/complete.ejs', {
			cago: cago
		});
	}));