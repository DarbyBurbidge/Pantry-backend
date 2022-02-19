import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model";

@ObjectType()
export class ShoppingList {

    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field(() => [String]) @prop({ required: true })
    itemIds: string[]

    @Field(() => [Item], { nullable: true })
    items: [Item];
}