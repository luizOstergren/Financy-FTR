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
import { TransactionModel } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';
import {
	CreateTransactionInput,
	EditTransactionInput,
} from '../dtos/input/transaction.input';
import { GqlUser } from '../graphql/decorators/user.decorator';
import { UserService } from '../services/user.service';
import { CategoryModel } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
	private transactionService = new TransactionService();
	private userService = new UserService();
	private categoryService = new CategoryService();

	@Mutation(() => TransactionModel)
	async createTransaction(
		@Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
		@GqlUser() user: UserModel,
	): Promise<TransactionModel> {
		return this.transactionService.createTransaction(data, user.id);
	}

  @Query(() => [TransactionModel])
	async listTransactionsByUser(
		@GqlUser() user: UserModel,
	): Promise<TransactionModel[]> {
		return this.transactionService.listTransactionsByUser(user.id);
	}

	@Mutation(() => TransactionModel)
	async editTransaction(
		@Arg('data', () => EditTransactionInput) data: EditTransactionInput,
		@GqlUser() user: UserModel,
	): Promise<TransactionModel> {
		return this.transactionService.editTransaction(data, user.id);
	}

	@Mutation(() => Boolean)
	async deleteTransaction(
		@Arg('id', () => String) id: string,
		@GqlUser() user: UserModel,
	): Promise<boolean> {
		return this.transactionService.deleteTransaction(id, user.id);
	}

	@FieldResolver(() => UserModel)
	async user(@Root() transaction: TransactionModel): Promise<UserModel> {
		return this.userService.findUser(transaction.userId);
	}

	@FieldResolver(() => CategoryModel, { nullable: true })
	async category(
		@Root() transaction: TransactionModel,
		@GqlUser() user: UserModel,
	): Promise<CategoryModel | null> {  // verificar esse null, usei para evitar erro de tipo, mas talvez seja melhor lançar um erro caso a categoria não seja encontrada
		return this.categoryService.findCategory(transaction.categoryId, user.id);
	}
}