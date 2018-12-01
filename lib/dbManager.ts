import {Sequelize} from 'sequelize-typescript'

import Driver from '../models/driver'
import Vendor from '../models/vendor'
import Cago from '../models/cago'
import logManager from './logManager'

const logger = logManager(module);

const curConfig = require('../config/config.json').db;

/**
 * [공식문서 참조](https://www.npmjs.com/package/sequelize-typescript#configuration)
 */
export const sequelize = new Sequelize({
	host: curConfig.host,
	database: curConfig.database,
	dialect: 'mysql',
	username: curConfig.user,
	password: curConfig.password,
	port: curConfig.port,
	storage: ':memory:',
	logging: logger.debug,
	timezone: '+09:00'
});

sequelize.addModels([Driver, Vendor, Cago]);

//Driver.removeAttribute('id');