import * as bodyParser from 'body-parser'
import * as express from 'express'
import {NextFunction, Request, Response} from 'express'
import {ValidationErrorItem} from 'sequelize'
import {Sequelize} from 'sequelize-typescript'

import {BadRequestError, ErrorRedirect, ErrorResponse, SendingAuthError} from '../../lib/errores'
import logManager from '../../lib/logManager'

import driverRouter from './driver'
import freightRouter from './freight'

const router = express.Router();
export default router;

const logger = logManager(module);

// HTTP body를 JSON 형식으로 만들어주는 middleware 설정
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/driver', driverRouter);
router.use('/freight', freightRouter);

/**
 * `/api/*`의 error handler.
 * `/api/*`에서 발생하는 모든 서버 에러는 이 handler를 통해서 응답을 전송
 */
router.use((err: any, req: Request, res: Response, _: NextFunction) => {
	res.status(err.resCode).json({
		message: err.errorMessage,
		data: err.data
	});
});