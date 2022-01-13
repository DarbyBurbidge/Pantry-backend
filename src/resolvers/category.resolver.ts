import { getModelForClass } from "@typegoose/typegoose";
import { Category } from "../models/category.model";
import { Item } from "../models/item.model";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { ReturnObject } from "./returnObject.resolver";


@Resolver(Category)
export class CategoryResolver {
    @Query(() => [Category], { nullable: true })
    async getCategories() {
        return await getModelForClass(Category).find()
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addCategory(
        @Arg('categoryName') categoryName: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            await getModelForClass(Category).create({userId: payload?.userId, categoryName: categoryName})
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async editCategoryName(
        @Arg('_id') _id: string,
        @Arg('categoryName') categoryName: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            await getModelForClass(Category).findOneAndUpdate({_id: _id, userId: payload?.userId}, {categoryName: categoryName})
        } catch (err) {
            console.log(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteCategory(
        @Arg('_id') _id: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            if (await getModelForClass(Category).find({userId: payload?.userId}).length <= 1) {
                return {message: "Cannot delete all categories, please edit the last category if you wish to change it", return: false}
            }
            // Prune all items associated with the category
            // TODO: add a migration boolean and id
            // to move items to a different category
            await getModelForClass(Item).deleteMany({categoryId: _id})
            await getModelForClass(Category).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }


    @FieldResolver(() => [Item], { nullable: true })
    async items(
        @Root() category : any
    ) {
        try {
            return await getModelForClass(Item).find({ categoryId: category._id })
        } catch (err) {
            console.error(err)
            return null
        }
    }
}