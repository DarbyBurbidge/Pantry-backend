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
let Item = class Item {
    _id;
    itemName;
    expiration;
    quantity;
    tags;
    favorite;
};
__decorate([
    Field(() => ID),
    prop({ auto: true }),
    __metadata("design:type", mongoose.Types.ObjectId)
], Item.prototype, "_id", void 0);
__decorate([
    Field(),
    prop({ required: true }),
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    Field(),
    prop({ required: true }),
    __metadata("design:type", String)
], Item.prototype, "expiration", void 0);
__decorate([
    Field(),
    prop({ type: Number, required: true }),
    __metadata("design:type", Number)
], Item.prototype, "quantity", void 0);
__decorate([
    Field(() => [String]),
    prop({ required: true, type: String, default: [] }),
    __metadata("design:type", Array)
], Item.prototype, "tags", void 0);
__decorate([
    Field(),
    prop({ default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "favorite", void 0);
Item = __decorate([
    ObjectType(),
    modelOptions({ options: { allowMixed: Severity.ERROR } })
], Item);
export { Item };
//# sourceMappingURL=item.model.js.map