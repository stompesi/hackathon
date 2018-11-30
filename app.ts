import * as express from 'express'
import * as session from 'express-session'
import * as morgan from 'morgan'
import * as passport from 'passport'
import * as path from 'path'

import apiController from './controllers/api/index'
import controller from './controllers/index'
import {sequelize} from './lib/dbManager'
import {logPath} from './lib/logManager'

const rfs = require('rotating-file-stream');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

// template engine 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// access 로그 설정
app.use(morgan('combined', {
	stream: rfs('access.log', {
		interval: '1d',
		size: '10M',
		path: logPath
	})
}));

// 정적 자원 매핑
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib/ejs.min.js', express.static(path.join(__dirname, 'node_modules', 'ejs', 'ejs.min.js')));
app.use('/lib/jquery.validate.min.js', express.static(path.join(__dirname, 'node_modules', 'jquery-validation', 'dist', 'jquery.validate.min.js')));
app.use('/lib/jquery.min.js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));

// express-session을 sequelize와 연결
const sequelizeStore = new SequelizeStore({
	db: sequelize,
	checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
	expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
});

// express-session 설정
app.use(session({
	store: sequelizeStore,
	secret: 'bitSecret',
	resave: false,
	saveUninitialized: false
}));

sequelizeStore.sync();

// passport 설정
app.use(passport.initialize());
app.use(passport.session());

// 라우터 연결
app.use('/api', apiController);
app.use(controller);

const port = process.env.PORT || 3000;
app.listen(port, () => {
		console.log('Listening on port ' + port);
	})
	.on('error', (err) => {
		console.error(err);
	});
