import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Item {
    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true, unique: true })
    itemName: string;

    @Field() @prop({ required: true })
    expiration: string;
}