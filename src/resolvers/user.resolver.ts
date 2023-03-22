// NPM MODULES
import { Arg, Field, Ctx, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
// DEV MODULES
import { AppContext } from "../context/app.context.js";
import { isAuth } from "../middleware/isauth.middleware.js";
import { User } from "../models/user.model.js";
import { Item } from "../models/item.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";
import { sendRefreshToken, createRefreshToken, createAccessToken } from "../lib/auth.js";
import { hashPassword, verifyPassword } from "../lib/utils.js";


@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
    @Field(() => User)
    user: User;
}

@Resolver(User)
export class UserResolver {

    //Get current User
    @Query(() => User, { nullable: true })
    async currentUser(
        @Ctx() context: AppContext
    ) {
        //pull the JWT from the request header
        const authorization = context.req.headers["authorization"];

        //make sure it's there
        if (!authorization) {
            return null
        }

        //if it is, verify it, and then attempt to find the user using the userId inside the token
        try {
            const token = authorization.split(' ')[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN_PUBLIC!, {algorithms: ['ES512']});
            console.log(payload.userId)
            return await getModelForClass(User).findById(payload.userId);
        } catch (err) {
            //if anything gives an error, return null and log the error
            console.log(err);
            return null
        }
    }

    //Login User and generate tokens if successful
    //otherwise throw clarifying errors
    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: AppContext
    ): Promise<LoginResponse> {
        console.log(res)
        const user = await getModelForClass(User).findOne({email: `${email}`})
        if (!user) {
            throw new Error('could not find user');
        }
        if (!verifyPassword(password, user.salt, user.pw_hash)) {
            throw new Error('password invalid');
        }

        //Login Successful
        //create and send a RefreshToken cookie
        sendRefreshToken(res, createRefreshToken(user));

        //return a new AccessToken
        return {
            accessToken: createAccessToken(user),
            user
        }
    }

    //Create a new User with client provided info
    //return whether the User was created properly
    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ) {
        const saltHash = hashPassword(password)
        try {
            const user = await getModelForClass(User).create({email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}`});
            if(user._id) {
                return true
            }
            throw new Error("user could not be created")
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }

    @Mutation(() => LoginResponse)
    async registerAndLogin(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: AppContext
    ): Promise<LoginResponse> {
        const saltHash = hashPassword(password)
        try {
            const user = await getModelForClass(User).create({email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}`});
            //create and send a RefreshToken cookie
            sendRefreshToken(res, createRefreshToken(user));

            //return a new AccessToken
            return {
                accessToken: createAccessToken(user),
                user
            }
        } catch (err) {
            console.log(err);
            throw new Error(err)
        }
    }


    //Create a new User with client provided info
    //return whether the User was created properly
    @Mutation(() => User)
    @UseMiddleware(isAuth)
    async editUser(    
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {payload}: AppContext
    ) {
        const saltHash = hashPassword(password)
        try {
            return await getModelForClass(User).findOneAndUpdate({_id: payload?.userId}, {email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}`, ttl: ""});
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }


    //Logout the user
    @Mutation(() => Boolean)
    async logout(
        @Ctx() {res}: AppContext
        ) {
            sendRefreshToken(res, "");
            return true
        }

    
    @FieldResolver(() => [Item])
    async items(
        @Root() user : any
    ) {
        try {
            return await getModelForClass(Item).find({ _id: {$in: user.itemIds }})
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }


    @FieldResolver(() => ShoppingList)
    async shoppingList(
        @Root() user : any
    ) {
        try {
            return await getModelForClass(ShoppingList).findById(user.shoppingListId)
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }
}