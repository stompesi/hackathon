import {
	AllowNull,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript'

@Table({
	underscored: true,
	underscoredAll: true,
	tableName: 'DRIVER'
})
export default class User extends Model<User> {
	@PrimaryKey
	@Column({type: DataType.STRING(9), field: 'LICENSE'})
	license!: string;

	@AllowNull(false)
	@Column({type: DataType.INTEGER, field: 'KAKAO_ID'})
	kakaoId!: number;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'NAME'})
	name!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'CAR_MODEL'})
	carModel!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'CAR_NUMBER'})
	carNumber!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'BUSINESS_NUMBER'})
	businessNumber!: string;

	// @AllowNull(false)
	@Column({type: DataType.STRING(100), field: 'ADDRESS'})
	address!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'PHONE_NUMBER'})
	phoneNumber!: string;

	@Column({type: DataType.STRING(50), field: 'COMPANNY'})
	company!: string;

	@Column({type: DataType.STRING(50), field: 'WALLET_ADDRESS'})
	walletAddress!: string;
}