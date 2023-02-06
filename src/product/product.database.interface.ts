import { AddProductDto } from './dto/product-add.dto';
import { EditProductDto } from './dto/product-edit.dto';
import { DeleteProductDto } from './dto/product-delete.dto';
import { GetProductDto } from './dto/product-get.dto';
import { idInDb, title } from './dto/product.props.dto';

export interface IProductDatabase {
	addProduct: (product: AddProductDto, title: title) => Promise<AddProductDto | unknown>;
	editProduct: (product: EditProductDto, id: idInDb) => Promise<EditProductDto | unknown>;
	deleteProduct: (id: idInDb) => Promise<DeleteProductDto | unknown>;
	getProduct: (id: idInDb) => Promise<GetProductDto | unknown>;
	getProducts: () => Promise<AddProductDto[] | unknown>;
}
