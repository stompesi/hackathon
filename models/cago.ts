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
	tableName: 'CAGO'
})
export default class Imformation extends Model<Imformation> {

	@PrimaryKey
	@Column({type: DataType.INTEGER, field: 'SEQ'})
	seq!: number;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'CAR_MODEL'})
	carModel!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'WISH_CARRY'})
    wishCarry!: string
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'START_POINT'})
    startPoint!: string;
    
    @AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'START_DAY'})
    startDay!: string;
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'START_TIME'})
	startTime!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'DESTNATION'})
    destination!: string;
    
    @AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'DESTNATION_DAY'})
    destinationDay!: string;
    
	@AllowNull(false)
	@Column({type: DataType.STRING(10), field: 'DESTNATION_TIME'})
	destinationTime!: string;

}