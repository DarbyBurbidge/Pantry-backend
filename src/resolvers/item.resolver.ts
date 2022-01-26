import { getModelForClass } from "@typegoose/typegoose";
import { Item } from "../models/item.model";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { ReturnObject } from "./returnObject.resolver";


const generateDate = (date: string) => {
    if (date == 'N/A') {
        return date
    }
    const seperated = date.split('-')
    const day = parseInt(seperated[2])
    const month = parseInt(seperated[1])
    const year = seperated[0].substring(seperated.length - 1);
    return `${month}/${day}/${year}`
}

@Resolver()
export class ItemResolver {
    @Query(() => [Item], { nullable: true })
    async getItems() {
        return await getModelForClass(Item).find()
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addItem(
        @Arg('itemName') itemName: string,
        @Arg('categoryId') categoryId: string,
        @Arg('expiration') expiration: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            const date = generateDate(expiration)
            await getModelForClass(Item).create({categoryId: categoryId, userId: payload?.userId, itemName: itemName, expiration: date})
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
        @Ctx() { payload }: AppContext
    ) {
        try {
            const date = generateDate(expiration);
            await getModelForClass(Item).findOneAndUpdate({_id: _id, userId: payload?.userId}, {itemName: itemName, expiration: date})
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
            await getModelForClass(Item).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

}