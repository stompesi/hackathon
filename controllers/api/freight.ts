/**
 * `/api/user`로 시작하는 API들의 라우터.
 * 유저에 관련된 API들이 존재
 *
 * @author 
 */

import * as express from 'express'
import {checkSchema} from 'express-validator/check'
import * as randomString from 'randomstring'

import {REGEX_BIRTH_DAY, REGEX_CELL_PHONE_NUMBER} from '../../lib/assertTools'
import * as contractManager from '../../lib/contractManager'
import {ErrorRedirect, ErrorResponse} from '../../lib/errores'
import * as passwordManager from '../../lib/hashManager'
import {AuthHelper} from '../../lib/phoneAuthManager'
import {isDriver} from '../../middlewares/asserter'
import {wrapGenerator} from '../../middlewares/asyncWrapper'

import User from '../../models/driver'

const wrap = wrapGenerator(module);
const authHelper = new AuthHelper();

const router = express.Router();
export default router;


router.post('/',
wrap('상점주 - 상점 생성', async (req, res) => {

  // const user = await User.findOne({
  //   where: {kakaoId: clientInfo.kakaoId},
  //   attributes: ['email']
  // });

  // if (user == null) {
  //   await User.create(clientInfo);
  // }


  res.sendStatus(200);
}));