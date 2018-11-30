/**
 * Express Router의 에러 핸들링과 로깅을 위한 wrapper를 만들어주는 모듈
 * @author 
 */

import {NextFunction, Request, Response} from 'express'
import {validationResult} from 'express-validator/check'
import {Transaction} from 'sequelize'
import {LoggerInstance} from 'winston'
import {sequelize} from '../lib/dbManager'
import {BadRequestError} from '../lib/errores'
import logManager from '../lib/logManager'


/**
 * `module`별로 로깅과 에러핸들링을 자동으로 해주는 wrapper 함수를 생성
 *
 * ## example:
 * ### __기존__
 * ```typescript
 * const logger = logManager(module);
 *
 * router.get((req, res) => {
 *     try {
 *         logger.info('some logging message');
 *         throw new Error('some error');
 *     }
 *     catch (err) {
 *         logger.info('some error message');
 *         // error handling
 *     }
 * })
 * ```
 *
 * ### __wrapper 적용__
 * ```typescript
 * const wrap = wrapGenerator(module);
 *
 * router.get(wrap('router description', (req, res, logger) => {
 *     throw new Error('some error');
 * })
 * ```
 *
 * @param module - Node.js 모듈
 * @returns express의 router-level middleware형식을 가지는 wrapper
 * @author 
 */
export function wrapGenerator(module: NodeJS.Module) {
	const logger = logManager(module);

	return function (description: string,
					 handler: (req: Request, res: Response,
							   logger: LoggerInstance, transaction: Transaction, next: NextFunction) => Promise<void>,
					 transaction_needed: boolean = false) {
		return async (req: Request, res: Response, next: NextFunction) => {
			logger.info(description);

			if (Object.keys(req.query).length != 0) logger.info('query', req.query);
			if (Object.keys(req.params).length != 0) logger.info('params', req.params);
			if ('body' in req && Object.keys(req.body).length != 0) logger.info('body', req.body);
			if ('file' in req) logger.info('file', req.file);

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const reasons = errors.array();

				logger.error(`${description} 실패`, reasons);
				return next(new BadRequestError(`${description} 실패`, reasons))
			}

			const tsx: Transaction | undefined = transaction_needed ? await sequelize.transaction() : undefined;

			try {
				await handler(req, res, logger, tsx, next);
				if (tsx) await tsx.commit();
				return
			}
			catch (err) {
				if (tsx) await tsx.rollback();
				logger.error(`${description} 실패`, err.stack);
				return next(err)
			}
		};
	}
}
