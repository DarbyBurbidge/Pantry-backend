import { getModelForClass, mongoose } from "@typegoose/typegoose";
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
    @UseMiddleware(isAuth)
    async deleteListItem(
        @Arg('_id') _id: string,
    ) {
        try {
            await getModelForClass(ShoppingList).findOneAndUpdate({$in: {itemIds: _id}}, {$pull: {itemIds: _id}})
            await getModelForClass(Item).findByIdAndDelete(_id)
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async migrateList(
        @Arg('itemIds', () => [String]) itemIds: string[],
        @Arg('shoppingListId') shoppingListId: string,
        @Ctx() { payload }: AppContext
    ) {
        try {
            const listItems = await getModelForClass(Item).find({_id: {$in: itemIds.map((id: string) => {return new mongoose.Types.ObjectId(id)})}});
            const user = await getModelForClass(User).findById(payload?.userId);
            const userItemIds = user?.itemIds
            const userItems = await getModelForClass(Item).find({_id: {$in: userItemIds?.map((id: string) => {return new mongoose.Types.ObjectId(id)})}});
            let conflictingItems: { userItem: Item, listItem: Item }[] = [];

            if (userItems) {
                console.log('user found');
                userItems.forEach((userItem) => {
                    listItems.some((listItem) => {
                        return (userItem.itemName === listItem.itemName) ? (
                            conflictingItems.push({userItem: userItem, listItem: listItem})
                        ) : (
                            false
                        )
                    })
                }) 
            }
            conflictingItems.forEach((conflictingItem) => {
                console.log(`Conflicts: ${conflictingItem.userItem.itemName} and ${conflictingItem.listItem.itemName}`)
            })
            conflictingItems.forEach(async (conflictingItem) => {
                await getModelForClass(Item).findOneAndUpdate({
                    _id: conflictingItem.userItem._id
                }, {
                    quantity: conflictingItem.userItem.quantity + conflictingItem.listItem.quantity,
                    tags: [...new Set(conflictingItem.userItem.tags.concat(conflictingItem.listItem.tags))] 
                })
            });


                      
            /*
            // Check if item name already exists in User, then generate a list of objects to update it
            let conflictingItems: {
                _id: string,
                itemName: string,
                quantity: number,
                expiration: string,
                tags: string[]
            }[] = [];
            if (userItems) {
                console.log("there is a user")
                for (let i = 0; i < userItems?.length!; i++) {
                    for (let k = 0; k < listItems.length; k++) {
                        if (userItems[i].itemName! === listItems[k].itemName) {
                            console.log("the check is working")
                            conflictingItems.push({
                                _id: String(userItems[i]._id),
                                itemName: userItems[i].itemName,
                                quantity: userItems[i].quantity + listItems[k].quantity,
                                expiration: userItems[i].expiration,
                                tags: [...new Set(userItems[i].tags.concat(listItems[k].tags))]
                            })
                            listItems.splice(k, 1);
                            k--;
                        }
                    }
                }
            }

            // Takes list of itemIds supplied and checks them against the listItems STILL IN THE LIST ofter the last step
            // Check if it's still on the list and create a new list of Ids to be deleted from the database
            // This is any itemIds that aren't classified as "NEW" for the user
            const deleteIds = itemIds.slice(0).reduce((previousValue: string[], currentValue: string) => {
                // Initial reducer just iterates through and sees if any value has a match against listItems
                // If not, it should be put on the list to be deleted
                const hasMatch = listItems.some((listItem) => {
                    return currentValue === listItem.id
                })
                !hasMatch ? previousValue?.push(currentValue) : null
                return previousValue;
            }, [])

            console.log(`Original List: ${itemIds}`)
            // Conflicts are items already associated with the user to be edited
            // Editing: Item
            console.log(`Num of Conflicts: ${conflictingItems.length}`)
            conflictingItems.forEach((conflictingItem) => {
                console.log(`ID: ${conflictingItem._id}`);
            })
            // New items are listItems: Item to be added to user.itemIds
            // Editing: User
            console.log(`New items: ${listItems.length}`)
            listItems.forEach((listItem) => {
                console.log(`ID: ${listItem.id}`);
            })
            // Delete items are items from listItems that need to be deleted
            // Their values have been taken and used to edit existing user items
            // Deleting: Item
            console.log(`Delete Items: ${deleteIds}`)
            //await getModelForClass(User).findByIdAndUpdate(payload?.userId, {$addToSet: {itemIds: { $each: itemIds}}})
            //await getModelForClass(ShoppingList).findByIdAndDelete(shoppingListId);
            */
            console.log(shoppingListId)
            
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
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