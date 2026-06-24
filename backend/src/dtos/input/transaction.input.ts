import { InputType, Field, Float } from 'type-graphql'

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount!: number

  @Field(() => String)
  description!: string

  @Field(() => Date)
  date!: Date

  @Field(() => String)
  categoryId!: string
}

@InputType()
export class EditTransactionInput {
  @Field(() => String)
  id!: string

  @Field(() => Float)
  amount!: number

  @Field(() => String)
  description!: string

  @Field(() => Date)
  date!: Date

  @Field(() => String)
  categoryId!: string
}