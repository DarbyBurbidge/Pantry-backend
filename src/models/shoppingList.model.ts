import { Severity, modelOptions, mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model.js";

@ObjectType() @modelOptions({ options: { allowMixed: Severity.ERROR }})
export class ShoppingList {


    @prop({ index: true, expires: 15780000, default: Date.now }) // 3months
    ttl: string

    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field(() => [String]) @prop({ required: true, type: String, default: [] })
    itemIds: string[]

    @Field(() => [Item], { nullable: true })
    items: [Item];
}