import { IProduct } from './product.interface';
import { Product } from './product.entity';

export interface IProductService {
	addProduct: (product: IProduct) => Promise<Product | null>;
	editProduct: (product: IProduct) => Promise<Product | null>;
	deleteProduct: (product: IProduct) => Promise<Product | null>;
	getProduct: (product: IProduct) => Promise<Product | null>;
	getProducts: () => Promise<Product[] | unknown>;
}
