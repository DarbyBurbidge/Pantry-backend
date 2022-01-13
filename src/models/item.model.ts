import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Item {
    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true })
    categoryId: string

    @Field() @prop({ required: true })
    userId: string

    @Field() @prop({ required: true})
    itemName: string;

    @Field() @prop({ required: true })
    expiration: string;
}