/**
 * `/driver`로 시작하는 페이지들의 라우터.
 * 기사과 관련된 페이지 렌더링
 *
 * @author stompesi
 */

import * as express from 'express'
import {isDriver} from '../middlewares/asserter'
import {wrapGenerator} from '../middlewares/asyncWrapper'

import Driver from '../models/driver'
import Cago from '../models/cago'

const wrap = wrapGenerator(module);

const router = express.Router();
export default router;

router.get('/',
	wrap('기사 - 초기 화면 요청', async (req, res) => {
		const driver = await Driver.findOne({
			where: {kakaoId: req.session!.kakaoId},
			attributes: ['kakaoId']
		});

		if (driver != null) {
			return res.render('driver/main.ejs');
		}

		res.render('driver/index.ejs');
	}));

router.get('/main', isDriver,
	wrap('기사 - 메인 페이지 요청', async (req, res) => {
		const renderData = {

		};

		res.render('driver/main.ejs', renderData);
	}));

router.get('/cago-list', isDriver,
	wrap('기사 - 진행중 페이지 요청', async (req, res) => {
		const driverId = req.session!.driverId;;

		const cagos = await Cago.findAll({
			where: {
				status: 1,
				driverId: driverId
			}
		});

		res.render('driver/cago-list.ejs', {
			cagos: cagos,
			category: 'ingoing'
		});
	}));

router.get('/cago-list/reservation', isDriver,
	wrap('기사 - 예약 페이지 요청', async (req, res) => {
		const driverId = req.session!.driverId;;

		const cagos = await Cago.findAll({
			where: {
				status: 2,
				driverId: driverId
			}
		});

		res.render('driver/cago-reservation-list.ejs', {
			cagos: cagos,
			category: 'reservation'
		});
	}));

router.get('/cago-list/complete', isDriver,
	wrap('기사 - 완료 페이지 요청', async (req, res) => {
		const driverId = req.session!.driverId;;

		const cagos = await Cago.findAll({
			where: {
				status: 3,
				driverId: driverId
			}
		});

		res.render('driver/cago-complete-list.ejs', {
			cagos: cagos,
			category: 'complete'
		});
	}));

router.get('/select-cago-list', isDriver,
	wrap('기사 - 메인 페이지 요청', async (req, res) => {
		const cagos = await Cago.findAll({
			where: {status: 0}
		});

		res.render('driver/select-cago-list.ejs', {
			cagos: cagos
		});
	}));
	

router.get('/cago-filter', isDriver,
	wrap('기사 - 메인 페이지 요청', async (req, res) => {
		const cagos = await Cago.findAll({
			where: {status: 0}
		});

		res.render('driver/cago-filter.ejs', {
			cagos: cagos
		});
	}));

router.get('/cago/:seq', isDriver,
	wrap('기사 - 메인 페이지 요청', async (req, res) => {
		const cago = await Cago.findOne({
			where: {seq: req.params.seq}
		});

		res.render('navigation/index.ejs', {
			cago: cago
		});
	}));


router.get('/logout', isDriver,
	wrap('기사 - 로그아웃 요청', async (req, res) => {
		req.session!.destroy((err: any) => {
			if (err) throw err;
		});

		req.logout();
		res.redirect('/driver');
	}));
