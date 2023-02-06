import { AddProductDto } from './dto/product-add.dto';
import { EditProductDto } from './dto/product-edit.dto';
import { DeleteProductDto } from './dto/product-delete.dto';
import { GetProductDto } from './dto/product-get.dto';

export interface IProductService {
	addProduct: (product: AddProductDto) => Promise<AddProductDto | unknown>;
	editProduct: (product: EditProductDto) => Promise<EditProductDto | unknown>;
	deleteProduct: (product: DeleteProductDto) => Promise<DeleteProductDto | unknown>;
	getProduct: (product: GetProductDto) => Promise<GetProductDto | unknown>;
	getProducts: () => Promise<AddProductDto[] | unknown>;
}
