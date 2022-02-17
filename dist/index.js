"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const server_1 = __importDefault(require("./server"));
const user_resolver_1 = require("./resolvers/user.resolver");
const item_resolver_1 = require("./resolvers/item.resolver");
dotenv_1.default.config();
mongoose_1.default.connect(`${process.env.DB_URI}`, async (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', async () => {
    console.log("connected to MongoDB Atlas");
});
(async () => {
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_resolver_1.UserResolver, item_resolver_1.ItemResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: server_1.default, cors: false });
    server_1.default.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`); });
})();
//# sourceMappingURL=index.js.map