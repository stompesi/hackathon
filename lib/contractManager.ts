/**
 * 이더리움의 스마트 컨트랙트를 사용하기위한 모듈
 *
 * @author stompesi
 */
import * as fs from 'fs-extra'
import * as path from 'path'
import Contract from 'web3/eth/contract'
import {TransactionObject} from 'web3/eth/types'
import {TransactionReceipt} from 'web3/types'
import logManager from '../lib/logManager'
import {ETHError} from './errores'


var Eth = require('web3-eth');
const logger = logManager(module);

const web3Config = require('../config/config.json').web3;
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(web3Config.url));

// new web3.eth.Contract(abi, address, options);

/**
 * 매 서버 실행시 solidity compile시 딜레이가 크기 때문에,
 * compile결과를 caching했다가 recompile이 필요한 때만 compile하도록 하는 코드
 *
 * @author 
 */
namespace SolidityCache {
	/**
	 * solidity 코드가 있는 path
	 */
	const CONTRACT_PATH = path.join(__dirname, '..', 'contract');

	const SOLIDITY_FILE_NAMES = [
		'SafeMath.sol',
		'ERC20Basic.sol',
		'BasicToken.sol',
		'ERC20.sol',
		'Ownable.sol',
		'StandardToken.sol',
		'Coupon.sol',
		'Stopable.sol',
		'Store.sol'
	];
	const SOLIDITY_FILES = SOLIDITY_FILE_NAMES.map(name => path.join(CONTRACT_PATH, name));


	const STORE_BYTECODE_NAME = 'store.bin';
	const STORE_ABI_NAME = 'store_abi.json';
	const STORE_BYTECODE_PATH = path.join(CONTRACT_PATH, STORE_BYTECODE_NAME);
	const STORE_ABI_PATH = path.join(CONTRACT_PATH, STORE_ABI_NAME);

	const COUPON_BYTECODE_NAME = 'coupon.bin';
	const COUPON_ABI_NAME = 'coupon_abi.json';
	const COUPON_BYTECODE_PATH = path.join(CONTRACT_PATH, COUPON_BYTECODE_NAME);
	const COUPON_ABI_PATH = path.join(CONTRACT_PATH, COUPON_ABI_NAME);

	/**
	 * recompile이 필요한지 확인하는 함수
	 *
	 * solidity 파일이 변경 됐거나, cache 파일이 없을 때 `true`반환
	 *
	 * @returns recompile 필요 여부
	 * @author 
	 */
	async function isRecompileRequired(): Promise<boolean> {
		if (!await fs.pathExists(STORE_BYTECODE_PATH) || !await fs.pathExists(STORE_ABI_PATH)) return true;
		if (!await fs.pathExists(COUPON_BYTECODE_PATH) || !await fs.pathExists(COUPON_ABI_PATH)) return true;


		const [storeByte, storeAbi] = await Promise.all([fs.stat(STORE_BYTECODE_PATH), fs.stat(STORE_ABI_PATH)]);
		const [couponByte, couponAbi] = await Promise.all([fs.stat(COUPON_BYTECODE_PATH), fs.stat(COUPON_ABI_PATH)]);


		if (!storeByte.isFile() || !storeAbi.isFile()) return true;
		if (!couponByte.isFile() || !couponAbi.isFile()) return true;


		// recompile is required if the lastModifiedTime of some solidity files are later than that of cached file
		const stats = await Promise.all(SOLIDITY_FILES.map(filePath => fs.stat(filePath)));
		return !stats.every(stat => stat.mtimeMs <= storeByte.mtimeMs && stat.mtimeMs <= storeAbi.mtimeMs)
			|| !stats.every(stat => stat.mtimeMs <= couponByte.mtimeMs && stat.mtimeMs <= couponAbi.mtimeMs);
	}


	/**
	 * `solc`모듈을 사용해 {@link SOLIDITY_FILE_NAMES}에 있는 모든 solidity 코드를 컴파일후 caching
	 *
	 * @returns
	 * @author , stompesi
	 */
	async function recompile(): Promise<[string, string, string, string]> {
		const solidityContents = await Promise.all(
			SOLIDITY_FILES.map(filePath => fs.readFile(filePath, 'UTF-8'))
		);

		const soliditySources: Record<string, string> = solidityContents.reduce((prev, curr, idx) => {
			prev[SOLIDITY_FILE_NAMES[idx]] = curr;
			return prev
		}, {} as Record<string, string>);

		const solc = require('solc');

		const output = solc.compile({sources: soliditySources}, 1);
		const storeBytecode = output.contracts['Store.sol:Store'].bytecode;
		const storeAbi = output.contracts['Store.sol:Store'].interface;

		const couponBytecode = output.contracts['Coupon.sol:Coupon'].bytecode;
		const couponAbi = output.contracts['Coupon.sol:Coupon'].interface;


		// store new bytecode and ABI to corresponding files
		await Promise.all([
			fs.writeFile(STORE_BYTECODE_PATH, storeBytecode),
			fs.writeFile(STORE_ABI_PATH, storeAbi),
			fs.writeFile(COUPON_BYTECODE_PATH, couponBytecode),
			fs.writeFile(COUPON_ABI_PATH, couponAbi)
		]);

		return [storeBytecode, storeAbi, couponBytecode, couponAbi];
	}


	/**
	 * recompile이 필요하다면 recompile 후, 필요없다면 cache 파일을 읽어서 반환
	 *
	 * @returns
	 * @author , stompesi
	 */
	export async function getContractAndAbi(): Promise<[TransactionObject<Contract>, any, TransactionObject<Contract>, any]> {
		let storeBytecode: string, storeAbi: string;
		let couponBytecode: string, couponAbi: string;


		if (await isRecompileRequired()) {
			logger.info('starting solidity code compile...');
			[storeBytecode, storeAbi, couponBytecode, couponAbi] = await recompile();
			logger.info('solidity codes are recompiled');
		}
		else {
			[storeBytecode, storeAbi, couponBytecode, couponAbi] = await Promise.all([
				fs.readFile(STORE_BYTECODE_PATH, 'UTF-8'),
				fs.readFile(STORE_ABI_PATH, 'UTF-8'),
				fs.readFile(COUPON_BYTECODE_PATH, 'UTF-8'),
				fs.readFile(COUPON_ABI_PATH, 'UTF-8')
			]);
		}

		const parsedStoreAbi = JSON.parse(storeAbi);
		const parsedCouponAbi = JSON.parse(couponAbi);

		const storeContract = new web3.eth.Contract(parsedStoreAbi);
		const couponContract = new web3.eth.Contract(parsedCouponAbi);

		const storeContractInstance = storeContract.deploy({
			data: '0x' + storeBytecode,
			arguments: []
		});

		const couponContractInstance = couponContract.deploy({
			data: '0x' + couponBytecode,
			arguments: []
		});

		return [storeContractInstance, parsedStoreAbi, couponContractInstance, parsedCouponAbi];
	}
}


let storeContract: TransactionObject<Contract>;
let storeAbi: any;

let couponContract: TransactionObject<Contract>;
let couponAbi: any;

SolidityCache.getContractAndAbi()
	.then(([storeSc, storeAb, couponSc, couponAb]) => {
		storeContract = storeSc;
		storeAbi = storeAb;

		couponContract = couponSc;
		couponAbi = couponAb;
	})
	.catch(err => logger.error('solidity 로드 실패', err.stack));


/**
 * 새로운 지갑 생성
 *
 * @param passphrase -
 * @returns
 * @author stompesi
 */
export function newAccount(passphrase: string): Promise<string> {
	logger.info('새로운 지갑 생성');

	return web3.eth.personal.newAccount(passphrase);
}

/**
 *
 * @param walletAddress -
 * @param passphrase -
 * @returns
 * @author stompesi
 */
// 지갑(상점주 ID, 사용자 ID) - Unlock
export async function unlockAccount(walletAddress: string, passphrase: string) {
	logger.info('지갑(상점주 ID, 사용자 ID) - Unlock', 'params', {passphrase, walletAddress});

	const isUnlocked = await web3.eth.personal.unlockAccount(walletAddress, passphrase, 1000);

	if (!isUnlocked) {
		throw new ETHError('wallet unlock 실패');
	}
}

// -------------------------------------------------------------------
// <상점 스마트컨트랙트 생성>
export async function createStoreContract(walletAddress: string, passphrase: string): Promise<string> {
	await unlockAccount(walletAddress, passphrase);
	
	logger.info('상점 스마트컨트랙트 생성', 'params', {walletAddress, passphrase});

	return await new Promise<string>(async (resolve, reject) => {
		storeContract.send({from: walletAddress})
			.on('error', reject)
			.on('receipt', (receipt: TransactionReceipt) => resolve(receipt.contractAddress))
	});
}

// 상점 적립금 적립 및 사용
export async function depositWithUsing(walletAddress: string, passphrase: string, storeContractAddress: string, userWalletAddress: string, depositAmount: number, useAmount: number, isDelivery: boolean): Promise<null> {
	await unlockAccount(walletAddress, passphrase);
	const contract = new web3.eth.Contract(storeAbi, storeContractAddress);
	
	logger.info('상점 적립금 적립 및 사용', 'params', {storeContractAddress, walletAddress, userWalletAddress, depositAmount, useAmount});
	
	return await new Promise<null>(async (resolve, reject) => {
		contract.methods.depositWithUsing(
			userWalletAddress,
			depositAmount,
			useAmount,
			isDelivery
		).send({from: walletAddress})
		.on('error', reject)
		.on('receipt', resolve);
	});
}

// -------------------------------------------------------------------
// <쿠폰 스마트컨트랙트 생성>
export async function createCouponContract(walletAddress: string, passphrase: string): Promise<string> {
	logger.info('쿠폰 스마트컨트랙트 생성');

	await unlockAccount(walletAddress, passphrase);

	return await new Promise<string>(async (resolve, reject) => {
		couponContract.send({from: walletAddress})
			.on('error', reject)
			.on('receipt', (receipt: TransactionReceipt) => resolve(receipt.contractAddress));
	});
}

// 쿠폰 정보 설정
// export async function setCouponInfo(walletAddress: string, passphrase: string, couponParams: Coupon, targetDescription: string): Promise<null> {
// 	await unlockAccount(walletAddress, passphrase);
// 	const contract = new web3.eth.Contract(couponAbi, couponParams.id);

// 	logger.info('쿠폰 정보 설정', 'params', couponParams);
	
// 	return await new Promise<null>(async (resolve, reject) => {
// 		contract.methods.setCouponInfo(
// 			couponParams.name,
// 			targetDescription,
// 			couponParams.downloadLimit,
// 			couponParams.startDate!.getTime() / 10000,
// 			couponParams.expirationDate!.getTime() / 1000,
// 			couponParams.discountType,
// 			couponParams.discountAmount | 0,
// 			couponParams.discountRatio | 0,
// 			couponParams.maxDiscountPrice | couponParams.discountAmount,
// 			couponParams.target,
// 			couponParams.minimumPrice | 0
// 		)
// 		.send({from: walletAddress})
// 		.on('error', reject)
// 		.on('receipt', resolve)
// 	});
// }

// 쿠폰 사용 확인 취소
export async function couponCancelUsingConfirm(walletAddress: string, passphrase: string, couponContractAddress: string, toWalletAddress: string): Promise<null> {
	await unlockAccount(walletAddress, passphrase);
	const contract = new web3.eth.Contract(couponAbi, couponContractAddress);
	
	logger.info('쿠폰 사용 확인 취소', 'params', {couponContractAddress, walletAddress, toWalletAddress});
	
	return await new Promise<null>(async (resolve, reject) => {
		contract.methods.couponCancleUsingConfirm(toWalletAddress).send({from: walletAddress})
		.on('error', reject)
		.on('receipt', resolve);
	});
}