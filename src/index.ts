// NPM MODULES
import "reflect-metadata"
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
// DEV MODULES
import app from "./server";
import { UserResolver } from "./resolvers/user.resolver";
import { ItemResolver } from "./resolvers/item.resolver";
import { ShoppingListResolver } from "./resolvers/shoppingList.resolver";



dotenv.config()
//console.log(process.env.ACCESS_TOKEN_SECRET)
mongoose.connect(
    `${process.env.DB_URI}`,
    async err => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
    }
)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', async () => {
    console.log("connected to MongoDB Atlas")
});

(async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ UserResolver, ItemResolver, ShoppingListResolver ]
        }),
        context: ({req, res}) => ({req, res})
    });
    await apolloServer.start()
    apolloServer.applyMiddleware({app, cors: false})
    app.listen({port: process.env.PORT, host: process.env.HOST}, () => {console.log(`Listening on port ${process.env.PORT}`)})
})();