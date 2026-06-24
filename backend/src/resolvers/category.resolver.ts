import {
	Arg,
	FieldResolver,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql';
import { UserModel } from '../models/user.model';
import { IsAuth } from '../middlewares/auth.middleware';
import { CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { GqlUser } from '../graphql/decorators/user.decorator';
import { CreateCategoryInput, EditCategoryInput} from '../dtos/input/category.input';
import { UserService } from '../services/user.service';

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
	private categoryService = new CategoryService();
	private userService = new UserService();

	@Mutation(() => CategoryModel)
	async createCategory(
		@Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
		@GqlUser() user: UserModel,
	): Promise<CategoryModel> {
		return this.categoryService.createCategory(data, user.id);
	}

  @Query(() => [CategoryModel])
	async listCategoriesByUser(
		@GqlUser() user: UserModel,
	): Promise<CategoryModel[]> {
		return this.categoryService.listCategoriesByUser(user.id);
	}

  @FieldResolver(() => UserModel)
	async user(@Root() category: CategoryModel): Promise<UserModel> {
		return this.userService.findUser(category.userId);
	}

	@Mutation(() => CategoryModel)
	async editCategory(
		@Arg('data', () => EditCategoryInput) data: EditCategoryInput,
		@GqlUser() user: UserModel,
	): Promise<CategoryModel> {
		return this.categoryService.editCategory(data, user.id);
	}

	@Mutation(() => Boolean)
	async deleteCategory(
		@Arg('id', () => String) id: string,
		@GqlUser() user: UserModel,
	): Promise<boolean> {
		return this.categoryService.deleteCategory(id, user.id);
	}

	@FieldResolver(() => Number)
	async transactionsCount(
		@Root() category: CategoryModel,
		@GqlUser() user: UserModel,
	): Promise<number> {
		return this.categoryService.countTransactionsInCategory(
			category.id,
			user.id,
		);
	}
}