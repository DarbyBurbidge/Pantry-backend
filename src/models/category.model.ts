import { mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model";



@ObjectType()
export class Category {
    @Field(() => ID) @prop({ auto: true })
    readonly _id: mongoose.Types.ObjectId;

    @Field() @prop({ required: true, unique: true })
    categoryName: string;

    @Field(() => ([Item] || null)) @prop()
    items: [Item] | null;
}