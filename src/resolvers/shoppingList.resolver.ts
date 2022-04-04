import { getModelForClass, mongoose } from "@typegoose/typegoose";
import { AppContext } from "../context/app.context";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Item } from "../models/item.model";
import { ShoppingList } from "../models/shoppingList.model";
import { ReturnObject } from "./returnObject.resolver";
import { isAuth } from "../middleware/isauth.middleware";
import { User } from "../models/user.model";


@Resolver(ShoppingList)
export class ShoppingListResolver {

    @Query(() => ShoppingList, { nullable: true }) 
    @UseMiddleware(isAuth)
    async getShoppingList(
        @Ctx() { payload }: AppContext
    ) {
        const user = await getModelForClass(User).findById({_id: payload?.userId});
        return await getModelForClass(ShoppingList).findById({_id: user?.shoppingListId});
    }

    // List Management Mutations
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addShoppingList(
        @Ctx() { payload }: AppContext
    ) {
        try {
            const shoppingList = await getModelForClass(ShoppingList).create({ itemIds: [] });
            await getModelForClass(User).findByIdAndUpdate(payload?.userId, { shoppingListId: shoppingList._id });
        } catch (err) {
            console.error(err);
            return { message: `${err}`, return: false }
        }
        return { message: "OK", return: true }
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteShoppingList(
        @Ctx() { payload }: AppContext
    ) {
        try {
            await getModelForClass(User).findByIdAndUpdate(payload?.userId, { shoppingListId: null });
            await getModelForClass(ShoppingList).findByIdAndDelete(payload?.listId);
        } catch (err) {
            console.error(err);
            return { message: `${err}`, return: false }
        }
        return { message: "OK", return: true }

    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async migrateList(
        @Arg('itemIds', () => [String]) itemIds: string[],
        @Ctx() { payload }: AppContext
    ) {
        try {
            const ItemDoc = getModelForClass(Item);
            const UserDoc = getModelForClass(User);
            const listItems = await ItemDoc.find({ _id: { $in: itemIds.map((id: string) => { return new mongoose.Types.ObjectId(id) }) } });
            const user = await UserDoc.findById(payload?.userId);
            const userItemIds = user?.itemIds;
            const userItems = await ItemDoc.find({ _id: { $in: userItemIds?.map((id: string) => { return new mongoose.Types.ObjectId(id) }) } });
            let conflictingItems: { userItem: Item, listItem: Item }[] = [];
            let newItemIds: string[] = [];


            // Checks if any listItem has a conflict
            // If it does, push it to the list of conflicts
            
            // This tells us if we can add it to the user
            // The opposite isn't true (checking if userItem has conflict)
            if (userItems) {
                console.log('user found');
                listItems.forEach((listItem) => {
                    const hasConflict = userItems.some((userItem) => {
                        return (userItem.itemName === listItem.itemName) ? (
                            conflictingItems.push({ userItem: userItem, listItem: listItem })
                        ) : (
                            false
                        )
                    })
                    !hasConflict ? newItemIds.push(listItem.id) : null;
                })
            }

            newItemIds.forEach((newItemId) => {
                console.log(`New Item: ${newItemId}`);
            })
            conflictingItems.forEach((conflictingItem) => {
                console.log(`Conflicts: ${conflictingItem.userItem.itemName} and ${conflictingItem.listItem.itemName}`);
            })

            // Use list of conflicts to update users existing items
            // After updating, delete the listItem since it's properties are no longer needed
            conflictingItems.forEach(async (conflictingItem) => {
                await ItemDoc.findOneAndUpdate({
                    _id: conflictingItem.userItem._id
                }, {
                    quantity: conflictingItem.userItem.quantity + conflictingItem.listItem.quantity,
                    tags: [...new Set(conflictingItem.userItem.tags.concat(conflictingItem.listItem.tags))],
                    favorite: conflictingItem.userItem.favorite || conflictingItem.listItem.favorite
                });
                await ItemDoc.findByIdAndDelete(conflictingItem.listItem._id);
            });

            // Update user's itemIds with Items from list (non-conflicting)
            await UserDoc.findByIdAndUpdate(
                payload?.userId, {
                    shoppingListId: null,
                    itemIds: [
                        ...new Set(user?.itemIds.concat(newItemIds))
                    ]
                }
            );
            // Delete Old ShoppingList
            await getModelForClass(ShoppingList).findByIdAndDelete(payload?.listId);

        } catch (err) {
            console.error(err)
            return { message: `${err}`, return: false }
        }
        return { message: "OK", return: true }
    }

    // Field Resolvers
    @FieldResolver(() => [Item], { nullable: true })
    async items(
        @Root() shoppingList: any
    ) {
        try {
            return await getModelForClass(Item).find({ _id: { $in: shoppingList.itemIds } })
        } catch (err) {
            console.error(err)
            return null
        }
    }
}