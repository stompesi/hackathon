import * as express from 'express'
import {NextFunction, Request, Response} from 'express'
import logManager from '../lib/logManager'

import kakaoRouter from './kakaoAuthController'

import driverRouter from './driverController'
import navigationRouter from './navigationController'
import vendorRouter from './vendorController'

import jhRouter from './jhController'

import cagoRouter from './cagoController'

const router = express.Router();
export default router

const logger = logManager(module);

router.use('/', kakaoRouter);
router.use('/driver', driverRouter);
router.use('/navigation', navigationRouter);
router.use('/vendor', vendorRouter);

router.use('/jh', jhRouter);
router.use('/cago', cagoRouter);

router.get('/', (req, res) => res.render('index.ejs'));
router.get('/error', (req, res) => res.render('index.ejs'));

/**
 * 페이지 라우터들의 error handler.
 * 페이지 라우터들에서 발생하는 모든 서버 에러는 이 handler를 통해서 응답을 전송
 */
router.use((err: Error, req: Request, res: Response, _: NextFunction) => {
	logger.error(`Unknown error from ${req.path}`, err);
	res.redirect('/error')
});