/**
 * `/freight`로 시작하는 페이지들의 라우터.
 * 화물과 관련된 페이지 렌더링
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

router.get('/', isDriver, wrap('화믈 - 등록', async (req, res) => res.render('navigation/index.ejs')));