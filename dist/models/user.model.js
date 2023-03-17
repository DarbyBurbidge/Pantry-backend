var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Severity, modelOptions, mongoose, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Item } from "./item.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";
let User = class User {
    _id;
    email;
    salt;
    pw_hash;
    tokenVersion;
    itemIds;
    items;
    shoppingListId;
    shoppingList;
};
__decorate([
    Field(() => ID),
    prop({ auto: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    Field(),
    prop({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "salt", void 0);
__decorate([
    prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "pw_hash", void 0);
__decorate([
    Field(),
    prop({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    Field(() => [String]),
    prop({ required: true, type: String, default: [] }),
    __metadata("design:type", Array)
], User.prototype, "itemIds", void 0);
__decorate([
    Field(() => [Item], { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "items", void 0);
__decorate([
    prop({ default: undefined }),
    __metadata("design:type", String)
], User.prototype, "shoppingListId", void 0);
__decorate([
    Field(() => ShoppingList, { nullable: true }),
    __metadata("design:type", ShoppingList)
], User.prototype, "shoppingList", void 0);
User = __decorate([
    ObjectType(),
    modelOptions({ options: { allowMixed: Severity.ERROR } })
], User);
export { User };
//# sourceMappingURL=user.model.js.map