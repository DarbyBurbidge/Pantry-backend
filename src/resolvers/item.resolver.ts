import { getModelForClass } from "@typegoose/typegoose";
import { Item } from "../models/item.model";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { ReturnObject } from "./returnObject.resolver";
import { addToParent, deleteFromParent, generateDate } from "../lib/utils";



@Resolver(Item)
export class ItemResolver {
    @Query(() => [Item], { nullable: true })
    async getItems() {
        return await getModelForClass(Item).find()
    }

    /* ADD ITEM */

    // Add to User
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addItem(
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Arg('tags', () => [String]) tags: string[],
        @Arg('parentType') parentType: string,
        @Arg('parentId') parentId: string,
        //@Ctx() { payload }: AppContext
    ) {
        try { 
            const date = generateDate(expiration);
            const item = await getModelForClass(Item).create({itemName: itemName, expiration: date, quantity: quantity, tags: tags});
            //await getModelForClass(User).findByIdAndUpdate(payload?.userId,{ $addToSet: {itemIds: item._id}});
            (addToParent[parentType] || addToParent['default'])(parentId, String(item._id));
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }
/*
    // Add to ShoppingList
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addListItem(
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Arg('tags', () => [String]) tags: string[],
        @Arg('listId') listId: string
    ) {
        try {
            const date = generateDate(expiration)
            const item = await getModelForClass(Item).create({ itemName: itemName, expiration: date, quantity: quantity, tags: tags })
            await getModelForClass(ShoppingList).findByIdAndUpdate(listId, { $addToSet: { itemIds: item._id } })

        } catch (err) {
            console.error(err)
            return { message: `${err}`, return: false }
        }
        return { message: "OK", return: true }
    }
*/
    /* Delete Item */

    // Delete from User
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteItem(
        @Arg('id') id: string,
        @Arg('parentType') parentType: string
    ) {
        try {
            (deleteFromParent[parentType] || deleteFromParent['default'])(id);
            await getModelForClass(Item).findByIdAndDelete(id);
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

/*    // Delete from ShoppingList
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteListItem(
        @Arg('_id') _id: string,
    ) {
        try {
            await getModelForClass(ShoppingList).findOneAndUpdate({ $in: { itemIds: _id } }, { $pull: { itemIds: _id } })
            await getModelForClass(Item).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return { message: `${err}`, return: false }
        }
        return { message: "OK", return: true }
    }
*/


    /* EDIT ITEM */

    // Edit is Parent Neutral
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async editItem(
        @Arg('id') id: string,
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Ctx() { payload }: AppContext
    ) {
        try {
            const date = generateDate(expiration);
            await getModelForClass(Item).findOneAndUpdate({_id: id, userId: payload?.userId}, {itemName: itemName, expiration: date, quantity: quantity})
        } catch (err) {
            console.log(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async toggleFavorite(
        @Arg('id') id: string
    ) {
        try {
            await getModelForClass(Item).findOneAndUpdate({_id: id}, [{$set:{favorite:{$eq:[false,"$favorite"]}}}]);
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }
}