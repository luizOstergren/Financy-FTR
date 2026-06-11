import { InputType, Field } from 'type-graphql'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String)
  password!: string
}

@InputType()
export class EditUserInput {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  password?: string
}