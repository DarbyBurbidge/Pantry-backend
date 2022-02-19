import { getModelForClass } from "@typegoose/typegoose";
import { AppContext } from "../context/app.context";
import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Item } from "../models/item.model";
import { ShoppingList } from "../models/shoppingList.model";
import { ReturnObject } from "./returnObject.resolver";
import { isAuth } from "../middleware/isauth.middleware";
import { User } from "../models/user.model";
import { generateDate } from "../lib/utils";


@Resolver(ShoppingList)
export class ShoppingListResolver {

    // List Management Mutations
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addShoppingList(
        @Ctx() { payload }: AppContext
    ) {
        try {
            const shoppingList = await getModelForClass(ShoppingList).create({itemIds: []})
            await getModelForClass(User).findByIdAndUpdate(payload?.userId, {shoppingListId: shoppingList._id})
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteShoppingList(
        @Arg('shoppingListId') shoppingListId: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            await getModelForClass(User).findByIdAndUpdate(payload?.userId, {shoppingListId})
            await getModelForClass(ShoppingList).findByIdAndDelete(shoppingListId)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}

    }

    // Related Document Mutations
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
            const item = await getModelForClass(Item).create({itemName: itemName, expiration: date, quantity: quantity, tags: tags})
            await getModelForClass(ShoppingList).findByIdAndUpdate(listId, { $addToSet: {itemIds: item._id}})
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    deleteListItem() {

    }

    // Field Resolvers
    @FieldResolver(() => [Item], { nullable: true })
    async items(
        @Root() shoppingList : any
    ) {
        try {
            return await getModelForClass(Item).find({ _id: {$in: shoppingList.itemIds }})
        } catch (err) {
            console.error(err)
            return null
        }
    }
}