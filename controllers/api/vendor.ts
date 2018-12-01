/**
 * `/api/user`로 시작하는 API들의 라우터.
 * 유저에 관련된 API들이 존재
 *
 * @author 
 */

import * as express from 'express'
import {Request, Response} from 'express'
import {checkSchema} from 'express-validator/check'
import * as randomString from 'randomstring'

import {REGEX_BIRTH_DAY, REGEX_CELL_PHONE_NUMBER} from '../../lib/assertTools'
import * as contractManager from '../../lib/contractManager'
import {ErrorRedirect, ErrorResponse} from '../../lib/errores'
import * as passwordManager from '../../lib/hashManager'
import {AuthHelper} from '../../lib/phoneAuthManager'
import {isDriver} from '../../middlewares/asserter'
import {wrapGenerator} from '../../middlewares/asyncWrapper'

import Vendor from '../../models/vendor'
import Imformation from '../../models/imformation'

const wrap = wrapGenerator(module);
const authHelper = new AuthHelper();

const router = express.Router();
export default router;

router.post('/', wrap('기사 - 등록', async (req: Request, res: Response) => {

  const vendorInfo: Vendor = req.body;

  await Vendor.create(vendorInfo);

  req.session!.vendorId = vendorInfo.id;

  console.log(req.session!.vendorId);

  res.sendStatus(200);
}));