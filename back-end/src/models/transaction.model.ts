import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { UserModel } from './user.model'
import { CategoryModel } from './category.model'

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => Number)
  amount!: number

  @Field(() => String)
  description!: string

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => String)
  userId!: string

  @Field(() => UserModel, { nullable: true })
  user?: UserModel

  @Field(() => String)
  categoryId!: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel | null
}