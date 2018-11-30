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
	tableName: 'USER'
})
export default class User extends Model<User> {
	@PrimaryKey
	@Column({type: DataType.INTEGER, field: 'SEQ'})
	seq!: number;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'EMAIL'})
	email!: string;

	@AllowNull(false)
	@Column({type: DataType.STRING(50), field: 'KAKAO_ID'})
	kakaoId!: string;
}