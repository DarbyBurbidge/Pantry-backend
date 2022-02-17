import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model";

@ObjectType()
export class User {

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

    @Field(() => [Item], { nullable: true })
    items: [Item];

    @Field(() => [String]) @prop({ required: false })
    tags: string[];
}