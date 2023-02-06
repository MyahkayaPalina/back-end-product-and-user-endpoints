import { id, title, price, description, img } from './product.props.dto';

export class EditProductDto {
	id: id;
	title?: title;
	price?: price;
	description?: description;
	img?: img;
}
