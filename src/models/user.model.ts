import { Severity, modelOptions, mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";


@ObjectType() @modelOptions({ options: { allowMixed: Severity.ERROR }})
export class User {


    // User Document Information
    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true, unique: true })
    email: string;

    @prop({ required: true })
    salt: string;

    @prop({ required: true })
    pw_hash: string;

    @Field() @prop({ default: 0 })
    tokenVersion: number;

    // Related Document information
    @Field(() => [String]) @prop({ required: true, type: String, default: [] })
    itemIds: string[]

    @Field(() => [Item], { nullable: true })
    items: Item[];

    @prop({default: undefined})
    shoppingListId?: string;

    @Field(() => ShoppingList, { nullable: true})
    shoppingList: ShoppingList;
}