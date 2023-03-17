import { Severity, modelOptions, mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";


@ObjectType() @modelOptions({ options: { allowMixed: Severity.ERROR }})
export class Item {
    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true})
    itemName: string;

    @Field() @prop({ required: true })
    expiration: string;

    @Field() @prop({ type: Number, required: true })
    quantity: number;

    @Field(() => [String]) @prop({ required: true, type: String, default: [] })
    tags: string[];

    @Field() @prop({ default: false })
    favorite: boolean;
}