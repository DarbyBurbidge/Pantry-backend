import { getModelForClass } from "@typegoose/typegoose";
import { Category } from "../models/category.model";
import { Item } from "../models/item.model";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";

@ObjectType()
class ReturnObject {
    @Field()
    message: string
    @Field()
    return: boolean
}

@Resolver(Category)
export class CategoryResolver {
    @Query(() => [Category], {nullable: true})
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
            await getModelForClass(Category).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }


    @FieldResolver(() => [Item])
    async items(
        @Root() category : any
    ) {
        try {
            return await getModelForClass(Item).find({ categoryId: category._id })
        } catch (err) {
            console.error(err)
            throw new Error(err)
        }
    }
}