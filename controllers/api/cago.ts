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

import Cago from '../../models/cago'

const wrap = wrapGenerator(module);
const authHelper = new AuthHelper();

const router = express.Router();
export default router;

router.post('/', wrap('배차 - 등록', async (req, res) => {

  const cagoInfo: Cago = req.body;

  cagoInfo.vendorId = req.session!.vendorId;

  console.log(cagoInfo);

  await Cago.create(cagoInfo);

  res.sendStatus(200);
}));

router.post('/accept', wrap('배차 -', async (req, res) => {
  
    const cagoSeq = req.body.cagoSeq;
    const driverId = req.session!.driverId;;

    console.log(driverId, cagoSeq);

    const vendor = await Cago.findOne({
			where: {status: 1, driverId: driverId},
			attributes: ['status']
    });
    
    console.log(vendor == null);
    if (vendor == null) {
      Cago.update({status: 1, driverId: driverId}, {
        where: {
          seq: cagoSeq,
        },
        returning: true
      });
    } else {
      Cago.update({status: 2, driverId: driverId}, {
        where: {
          seq: cagoSeq,
        },
        returning: true
      });
    }

    res.sendStatus(200);
  }));