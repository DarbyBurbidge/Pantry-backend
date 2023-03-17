// NPM MODULES
import "reflect-metadata"
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"
import { buildSchema } from "type-graphql";
import { createServer } from "https";
// DEV MODULES
import { app } from "./server.js";
import { UserResolver } from "./resolvers/user.resolver.js";
import { ItemResolver } from "./resolvers/item.resolver.js";
import { ShoppingListResolver } from "./resolvers/shoppingList.resolver.js";
import { getSecrets } from "./AWSsecrets.js";


console.log(process.env)
if (process.env.NODE_ENV === "prod") {
    try {
        await getSecrets()
    } catch (err) {
        console.error(err)
    }
} else {
    dotenv.config()
}
console.log(process.env)
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
        })
    });
    await apolloServer.start()
    app.use('/graphql', expressMiddleware(apolloServer))
    const server = createServer(app)
    server.listen({ port: process.env.PORT }, () => {console.log(`Listening on port ${process.env.PORT}`)});
})();