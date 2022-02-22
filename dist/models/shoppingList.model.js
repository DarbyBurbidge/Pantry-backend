"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingList = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const item_model_1 = require("./item.model");
let ShoppingList = class ShoppingList {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typegoose_1.prop)({ auto: true }),
    __metadata("design:type", typegoose_1.mongoose.Types.ObjectId)
], ShoppingList.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Array)
], ShoppingList.prototype, "itemIds", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [item_model_1.Item], { nullable: true }),
    __metadata("design:type", Array)
], ShoppingList.prototype, "items", void 0);
ShoppingList = __decorate([
    (0, type_graphql_1.ObjectType)()
], ShoppingList);
exports.ShoppingList = ShoppingList;
//# sourceMappingURL=shoppingList.model.js.map