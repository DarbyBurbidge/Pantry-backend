import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model";
import { ShoppingList } from "../models/shoppingList.model";


@ObjectType()
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
    @prop()
    itemIds: string[]

    @Field(() => [Item], { nullable: true })
    items: [Item];

    @prop()
    shoppingListId: string;

    @Field(() => ShoppingList, { nullable: true})
    shoppingList: ShoppingList;
}