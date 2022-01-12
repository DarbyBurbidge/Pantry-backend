// NPM MODULES
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
// DEV MODULES
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { User } from "../models/user.model";
import { sendRefreshToken, createRefreshToken, createAccessToken } from "../lib/auth";
import { hashPassword, verifyPassword } from "../lib/utils";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "working!"
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(
        @Ctx() {payload}: AppContext
    ) {
        return `your user id is: ${payload!.userId}`
    }

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
        @Arg('password') password: string,
    ) {
        const saltHash = hashPassword(password)
        try {
            await getModelForClass(User).create({email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}`});
        } catch (err) {
            console.log(err);
            return false
        }
        return true
    }

    //Logout the user
    @Mutation(() => Boolean)
    async logout(
        @Ctx() {res}: AppContext
        ) {
            sendRefreshToken(res, "");
            return true
        }
}