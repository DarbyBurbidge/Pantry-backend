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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryResolver = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const category_model_1 = require("../models/category.model");
const item_model_1 = require("../models/item.model");
const type_graphql_1 = require("type-graphql");
const isauth_middleware_1 = require("../middleware/isauth.middleware");
const returnObject_resolver_1 = require("./returnObject.resolver");
let CategoryResolver = class CategoryResolver {
    async getCategories() {
        return await (0, typegoose_1.getModelForClass)(category_model_1.Category).find();
    }
    async addCategory(categoryName, { payload }) {
        try {
            await (0, typegoose_1.getModelForClass)(category_model_1.Category).create({ userId: payload === null || payload === void 0 ? void 0 : payload.userId, categoryName: categoryName });
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async editCategoryName(_id, categoryName, { payload }) {
        try {
            await (0, typegoose_1.getModelForClass)(category_model_1.Category).findOneAndUpdate({ _id: _id, userId: payload === null || payload === void 0 ? void 0 : payload.userId }, { categoryName: categoryName });
        }
        catch (err) {
            console.log(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async deleteCategory(_id, { payload }) {
        try {
            if (await (0, typegoose_1.getModelForClass)(category_model_1.Category).find({ userId: payload === null || payload === void 0 ? void 0 : payload.userId }).length <= 1) {
                return { message: "Cannot delete all categories, please edit the last category if you wish to change it", return: false };
            }
            await (0, typegoose_1.getModelForClass)(item_model_1.Item).deleteMany({ categoryId: _id });
            await (0, typegoose_1.getModelForClass)(category_model_1.Category).findByIdAndDelete(_id);
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async items(category) {
        try {
            return await (0, typegoose_1.getModelForClass)(item_model_1.Item).find({ categoryId: category._id });
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [category_model_1.Category], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategories", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('categoryName')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "addCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id')),
    __param(1, (0, type_graphql_1.Arg)('categoryName')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "editCategoryName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [item_model_1.Item], { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "items", null);
CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)(category_model_1.Category)
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
//# sourceMappingURL=category.resolver.js.map