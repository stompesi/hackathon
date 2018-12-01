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
	tableName: 'VENDOR'
})
export default class Vendor extends Model<Vendor> {
	@PrimaryKey
	@Column({type: DataType.STRING(50), field: 'ID'})
	id!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'PASSWD'})
    passwd!: string
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'BUSINESS_NUMBER'})
    businessNumber!: string;
    
    @AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'COMPANNY_NAME'})
    companyName!: string;
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'COMPANNY_NUMBER'})
	companyNumber!: string;

}