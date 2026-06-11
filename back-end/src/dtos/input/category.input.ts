import { InputType, Field } from 'type-graphql'

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String)
  color!: string

  @Field(() => String)
  icon!: string
}

@InputType()
export class EditCategoryInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => String)
  color!: string

  @Field(() => String)
  icon!: string
}