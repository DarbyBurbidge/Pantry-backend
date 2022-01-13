import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Category } from "./category.model";

@ObjectType()
export class User {

    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true, unique: true })
    email: string;

    @Field() @prop({ required: true })
    userName: string

    @prop({ required: true })
    salt: string;

    @prop({ required: true })
    pw_hash: string;

    @Field() @prop({ default: 0})
    tokenVersion: number;

    @Field(() => [Category])
    categories: [Category];
}