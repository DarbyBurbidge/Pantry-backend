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
let ShoppingList = class ShoppingList {
    _id;
    itemIds;
    items;
};
__decorate([
    Field(() => ID),
    prop({ auto: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], ShoppingList.prototype, "_id", void 0);
__decorate([
    Field(() => [String]),
    prop({ required: true, type: String, default: [] }),
    __metadata("design:type", Array)
], ShoppingList.prototype, "itemIds", void 0);
__decorate([
    Field(() => [Item], { nullable: true }),
    __metadata("design:type", Array)
], ShoppingList.prototype, "items", void 0);
ShoppingList = __decorate([
    ObjectType(),
    modelOptions({ options: { allowMixed: Severity.ERROR } })
], ShoppingList);
export { ShoppingList };
//# sourceMappingURL=shoppingList.model.js.map