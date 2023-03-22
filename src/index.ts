// NPM MODULES
import "reflect-metadata";
//import { createServer } from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4"
import { buildSchema } from "type-graphql";
// DEV MODULES
import { app } from "./server.js";
import { UserResolver } from "./resolvers/user.resolver.js";
import { ItemResolver } from "./resolvers/item.resolver.js";
import { ShoppingListResolver } from "./resolvers/shoppingList.resolver.js";
import { getSecrets } from "./AWSsecrets.js";
import { AppContext } from "./context/app.context.js";

if (process.env.NODE_ENV === "prod") {
    try {
        await getSecrets()
    } catch (err) {
        console.error(err)
    }
} else {
    dotenv.config()
}
mongoose.connect(
    `${process.env.DB_URI}`,
    async err => {
        if (err) {
            console.error(err)
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
    const apolloServer = new ApolloServer<AppContext>({
        schema: await buildSchema({
            resolvers: [ UserResolver, ItemResolver, ShoppingListResolver ]
        }),
        introspection: process.env.NODE_ENV !== 'prod'
    });
    await apolloServer.start()
    app.use('/graphql',
        expressMiddleware(apolloServer, {
            // Must name context here since AppContext is a custom context
            context: async ({req, res}) => ({req, res})
        })
    )

    app.listen({ port: process.env.PORT }, () => {console.log(`Listening on port ${process.env.PORT}`)});
})();