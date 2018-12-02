/**
 * 서버 내에서의 오류 핸들링을 위한 custom Error classes
 */


export abstract class InServerError extends Error {
}

export class ETHError extends InServerError {
	constructor(message: string, transactionHash?: string) {
		super(message);
		this.transactionHash = transactionHash;
	}

	public readonly transactionHash?: string;

}

export class ErrorResponse extends InServerError {
	public readonly name = 'ErrorResponse';

	public readonly resCode: number;
	public readonly errorMessage: string;
	public readonly data?: Record<string, any>;

	constructor(description: string, resCode: number, errorMessage: string, data?: Record<string, any>) {
		super(description);

		this.resCode = resCode;
		this.errorMessage = errorMessage;
		this.data = data;
	}
}

export class ErrorRedirect extends InServerError {
	public readonly name = 'ErrorRedirect';

	public readonly url: string;

	constructor(description: string, url: string) {
		super(description);

		this.url = url;
	}
}

export class BadRequestError extends InServerError {
	public readonly name = 'BadRequestError';

	public readonly reasons: any[];

	constructor(description: string, reasons: any[]) {
		super(description);

		this.reasons = reasons;
	}
}

export class SendingAuthError extends InServerError {
	public readonly name = 'SendingAuthError';
	public readonly body: string;

	constructor(body: string) {
		super('Failed to send auth SMS');
		this.body = body;
	}
}