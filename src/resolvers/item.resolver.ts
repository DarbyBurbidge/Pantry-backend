import { getModelForClass } from "@typegoose/typegoose";
import { Item } from "../models/item.model";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { generateDate } from "../lib/utils";
import { User } from "../models/user.model";
import { ShoppingList } from "../models/shoppingList.model";



@Resolver(Item)
export class ItemResolver {
    @Query(() => [Item], { nullable: true })
    async getItems() {
        return await getModelForClass(Item).find()
    }

    /* ADD ITEM */

    // Add to User
    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async addItem(
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Arg('tags', () => [String]) tags: string[],
        @Arg('parentType') parentType: string,
        @Ctx() { payload }: AppContext
    ) {
        try { 
            const date = generateDate(expiration);
            const item = await getModelForClass(Item).create({itemName: itemName, expiration: date, quantity: quantity, tags: tags});
            parentType === "user" ? await getModelForClass(User).findByIdAndUpdate(payload?.userId, { $addToSet: {itemIds: item.id}}) : null;
            parentType === "list" ? await getModelForClass(ShoppingList).findByIdAndUpdate(payload?.listId, { $addToSet: {itemIds: item.id}}) : null;
            return item;
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
    }


    /* Delete Item */

    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async deleteItem(
        @Arg('id') id: string,
        @Arg('parentType') parentType: string,
    ) {
        try {
            parentType === "user" ? await getModelForClass(User).findOneAndUpdate({$in: {itemIds: id}}, {$pull: {itemIds: id}}) : null;
            parentType === "list" ?  await getModelForClass(ShoppingList).findOneAndUpdate({$in: {itemIds: id}}, {$pull: {itemIds: id}}): null;
            return await getModelForClass(Item).findByIdAndDelete(id);
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
    }


    /* EDIT ITEM */
    @Mutation(() => Item)
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
            return await getModelForClass(Item).findOneAndUpdate({_id: id, userId: payload?.userId}, {itemName: itemName, expiration: date, quantity: quantity}, {new: true})
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    /* toggles the favorite entry in the associated item */
    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async toggleFavorite(
        @Arg('id') id: string
    ) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({_id: id}, [{$set:{favorite:{$eq:[false,"$favorite"]}}}], {new: true});
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
    }

    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async setQuant(
        @Arg('id') id: string,
        @Arg('newQuant') newQuant: number
    ) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({_id: id}, {quantity: newQuant}, {new: true});
        } catch (err) {
            console.error(err);
            throw new Error(err);
            //return {message: `${err}`, return: false}
        }
        //return {message: "OK", return: true}
    }

    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async setExp(
        @Arg('id') id: string,
        @Arg('newExp') newExp: string
    ) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({_id: id}, {expiration: generateDate(newExp)}, {new: true})
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }

    @Mutation(() => Item)
    @UseMiddleware(isAuth)
    async setName(
        @Arg('id') id: string,
        @Arg('newName') newName: string
    ) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({_id: id}, {itemName: newName}, {new: true})
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
}