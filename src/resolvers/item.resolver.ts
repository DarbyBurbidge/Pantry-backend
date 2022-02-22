import { getModelForClass } from "@typegoose/typegoose";
import { Item } from "../models/item.model";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { ReturnObject } from "./returnObject.resolver";
import { User } from "../models/user.model";
import { generateDate } from "../lib/utils";




@Resolver(Item)
export class ItemResolver {
    @Query(() => [Item], { nullable: true })
    async getItems() {
        return await getModelForClass(Item).find()
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addItem(
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Arg('tags', () => [String]) tags: string[],
        @Ctx() { payload }: AppContext
    ) {
        try { 
            const date = generateDate(expiration)
            const item = await getModelForClass(Item).create({itemName: itemName, expiration: date, quantity: quantity, tags: tags})
            await getModelForClass(User).findByIdAndUpdate(payload?.userId,{ $addToSet: {itemIds: item._id}})
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async editItem(
        @Arg('_id') _id: string,
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Ctx() { payload }: AppContext
    ) {
        try {
            const date = generateDate(expiration);
            await getModelForClass(Item).findOneAndUpdate({_id: _id, userId: payload?.userId}, {itemName: itemName, expiration: date, quantity: quantity})
        } catch (err) {
            console.log(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteItem(
        @Arg('_id') _id: string,
    ) {
        try {
            await getModelForClass(User).findOneAndUpdate({$in: {itemIds: _id}}, {$pull: {itemIds: _id}})
            await getModelForClass(Item).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

}