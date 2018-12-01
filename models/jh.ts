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
	tableName: 'DRIVER_MONEY'
})
export default class jh extends Model<jh> {

	@PrimaryKey
	@Column({type: DataType.STRING(50), field: 'ID'})
	id!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'ACCOUNT'})
	account!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'MONEY_WITHDRAW'})
    moneyWithdraw!: string
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'BANK'})
    bank!: string;

}