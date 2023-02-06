import { title, price, description, img } from './product.props.dto';

export class AddProductDto {
	title: title;
	price?: price;
	description?: description;
	img?: img;
}
