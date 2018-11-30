import * as bodyParser from 'body-parser'
import * as express from 'express'
import {NextFunction, Request, Response} from 'express'
import {ValidationErrorItem} from 'sequelize'
import {Sequelize} from 'sequelize-typescript'

import {BadRequestError, ErrorRedirect, ErrorResponse, SendingAuthError} from '../../lib/errores'
import logManager from '../../lib/logManager'

import userRouter from './user'


const router = express.Router();
export default router;

const logger = logManager(module);

// HTTP body를 JSON 형식으로 만들어주는 middleware 설정
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/user', userRouter);

/**
 * `/api/*`의 error handler.
 * `/api/*`에서 발생하는 모든 서버 에러는 이 handler를 통해서 응답을 전송
 */
router.use((err: Error, req: Request, res: Response, _: NextFunction) => {
	if (err instanceof ErrorResponse) {
		res
			.status(err.resCode)
			.json({
				message: err.errorMessage,
				data: err.data
			});
	}
	else if (err instanceof BadRequestError) {
		res
			.status(400)
			.json({
				message: err.message,
				reasons: err.reasons
			})
	}
	else if (err instanceof ErrorRedirect) {
		res.redirect(err.url);
	}
	else if (err instanceof SendingAuthError) {
		res.status(500).json({message: '서버 오류. 재시도 요망'});
	}
	else if (err instanceof Sequelize.UniqueConstraintError) {
		logger.error(`DB Unique validation error`, err.errors.map((v: ValidationErrorItem) => ({
			message: v.message,
			type: v.type,
			path: v.path,
			value: v.value
		})));
		res.status(500).json({message: '디비 오류'});
	}
	else if (err instanceof Sequelize.ValidationError) {
		logger.error(`DB validation error`, err.errors.map((v: ValidationErrorItem) => ({
			message: v.message,
			type: v.type,
			path: v.path,
			value: v.value
		})));
		res.status(500).json({message: '디비 오류'});
	}
	else if (err instanceof Sequelize.DatabaseError && err.original.code.startsWith('BC')) {
		const responseCode = parseInt(err.original.code.substr(2));

		if (responseCode == 403) {
			logger.warn('Forbidden access happened', err);
		}

		res.status(responseCode).json({message: err.original.message});
	}
	else if (err instanceof Sequelize.Error) {
		logger.error('Unknown DB error', err);
		res.status(500).json({message: '디비 오류'});
	}
	else {
		logger.error(`Unknown error from ${req.path}`, err);
		res.status(500).json({message: '서버 오류'});
	}
});
