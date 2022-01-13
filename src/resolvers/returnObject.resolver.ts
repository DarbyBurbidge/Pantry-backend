import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class ReturnObject {
    @Field()
    message: string
    @Field()
    return: boolean
}