import { IProduct } from './product.interface';

export class Product {
	private _id: string | undefined;
	private _title: string | undefined;
	private _price: string | undefined;
	private _description: string | undefined;
	private _img: string | undefined;

	constructor(product: IProduct) {
		this._id = product.id;
		this._title = product.title;
		this._price = product.price;
		this._description = product.description;
		this._img = product.img;
	}

	get id(): string | undefined {
		return this._id;
	}

	get title(): string | undefined {
		return this._title;
	}

	get price(): string | undefined {
		return this._price;
	}
	get description(): string | undefined {
		return this._description;
	}
	get img(): string | undefined {
		return this._img;
	}
}
