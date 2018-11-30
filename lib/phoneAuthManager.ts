import * as crypto from 'crypto'
import * as got from 'got'
import * as randomString from 'randomstring'
import {SendingAuthError} from './errores'

const snsApi = require('../config/config.json').auth.sns;

/**
 * 전화번호 인증 관련된 작업들을 관리하는 클래스
 * @author 
 */
export class AuthHelper {
	protected waitTimerMap = new Map<string, NodeJS.Timer>();
	protected authNumberMap = new Map<string, string>();
	protected validatedPhones = new Set<string>();


	/**
	 * `phoneNumber`로 `password`를 임시 비밀번호로 전송
	 *
	 * @param phoneNumber - 임시 비밀번호를 보낼 사용자 전화번호
	 * @param password - 임시 비밀번호
	 * @returns 임시 비밀번호
	 * @author 
	 */
	static async sendNewPassword(phoneNumber: string, password: string): Promise<string> {
		const response = await got(snsApi.api_address, {
			body: AuthHelper.genPayload(phoneNumber, `비트쿠폰 임시비밀번호 : ${password}`),
			form: true
		});

		/*
		 전송결과 코드표 참조 : https://www.coolsms.co.kr/index.php?mid=Legacy_Result_Codes

		 response body example:
		 {
			 "group_id": "R1G5AFA684B59028",
			 "success_count": 1,
			 "error_count": 0,
			 "result_code": "00",
			 "result_message": "Success"
		 }
		 */
		const resultCode = JSON.parse(response.body).result_code;

		// 문자가 옳바르게 전송되었는지 확인
		if (resultCode !== '00') {
			throw new SendingAuthError(response.body);
		}

		return password;
	}


	/**
	 * 5자리의 인증번호 생성
	 *
	 * @returns 5자리의 인증번호
	 * @author 
	 */
	protected static genAuthNumber(): string {
		// 인증번호 생성
		let authenticationNumber = Math.floor(Math.random() * 100_000 % 100_000).toString();
		if (authenticationNumber.length != 5) {
			authenticationNumber = '0'.repeat(5 - authenticationNumber.length) + authenticationNumber;
		}

		return authenticationNumber;
	}


	/**
	 * `phoneNumber`에게 내용 `message`을 문자로 전송하기 위한 payload 생성
	 *
	 * @param phoneNumber - 문자를 보낼 전화번호
	 * @param message - 문자 내용
	 * @returns payload
	 * @author stompesi
	 */
	protected static genPayload(phoneNumber: string, message: string): Record<string, any> {
		// 문자 보낼 필요 변수 설정
		const timestamp = Math.floor(Date.now() / 1000);
		const salt = randomString.generate(30);
		const signature = crypto
			.createHmac('md5', snsApi.api_secret)
			.update(timestamp + salt)
			.digest('hex');
		const messageInfo = [{
			type: 'SMS', // TODO: 설정파일로 변경하기
			to: phoneNumber,
			from: '0230195623', // TODO: 서비스시 변경해야 함
			text: message
		}];

		return {
			api_key: snsApi.api_key,
			timestamp: timestamp,
			salt: salt,
			signature: signature,
			extension: JSON.stringify(messageInfo)
		};
	}

	/**
	 * `phoneNumber`에게 인증번호 전송
	 *
	 * @param phoneNumber 인증번호를 보낼 전화번호
	 * @returns 인증번호
	 * @author stompesi
	 */
	public async sendAuthNumber(phoneNumber: string): Promise<string> {
		const authNumber = AuthHelper.genAuthNumber();

		const response = await got(snsApi.api_address, {
			body: AuthHelper.genPayload(phoneNumber, `비트쿠폰 인증번호 : ${authNumber}`),
			form: true
		});

		/*
		 전송결과 코드표 참조 : https://www.coolsms.co.kr/index.php?mid=Legacy_Result_Codes

		 response body example:
		 {
			 "group_id": "R1G5AFA684B59028",
			 "success_count": 1,
			 "error_count": 0,
			 "result_code": "00",
			 "result_message": "Success"
		 }
		 */
		const resultCode = JSON.parse(response.body).result_code;

		// 문자가 옳바르게 전송되었는지 확인
		if (resultCode !== '00') {
			throw new SendingAuthError(response.body);
		}

		// 최대 대기 대기시간 설정 (3분 10초 - 클라잉너트에 응답 시간이 있을 수 있음으로 10초 여유)
		const MAX_WAIT_TIME = 1000 * (60 * 3 + 10);

		if (this.waitTimerMap.has(phoneNumber)) {
			clearTimeout(this.waitTimerMap.get(phoneNumber) as NodeJS.Timer);
			this.waitTimerMap.delete(phoneNumber);
			this.validatedPhones.delete(phoneNumber);
		}

		// 모바일(휴대폰번호)의 검증 할 인증번호 등록
		this.authNumberMap.set(phoneNumber, authNumber);

		// 대기시간 타이머 시작 - 대기시간이 지나면 리셋함
		this.waitTimerMap.set(phoneNumber, setTimeout(() => {
			clearTimeout(this.waitTimerMap.get(phoneNumber) as NodeJS.Timer);
			this.waitTimerMap.delete(phoneNumber);
			this.validatedPhones.delete(phoneNumber);
			this.authNumberMap.delete(phoneNumber);
		}, MAX_WAIT_TIME));

		return authNumber;
	}

	public validateAuthNumber(phoneNumber: string, authenticationNumber: string): boolean {
		// 모바일(휴대폰번호)의 검증 할 인증번호와 사용자 입력 인증번호 비교후 검증완료
		if (this.authNumberMap.get(phoneNumber) == authenticationNumber) {
			clearTimeout(this.waitTimerMap.get(phoneNumber) as NodeJS.Timer);
			this.waitTimerMap.delete(phoneNumber);
			this.validatedPhones.add(phoneNumber);

			return true
		}

		return false;
	}

	public isValidated(phoneNumber: string): boolean {
		return this.validatedPhones.has(phoneNumber);
	}

	public isPending(phoneNumber: string): boolean {
		return this.authNumberMap.has(phoneNumber);
	}

	public delValidatedPhone(phoneNumber: string) {
		this.validatedPhones.delete(phoneNumber);
	}
}
