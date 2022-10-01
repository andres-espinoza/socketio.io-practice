export interface IProduct {
  title: string;
  price: number;
  thumbnail: string;
}

class Product {
  title: string;

  price: string;

  thumbnail: string;

  readonly id: number;

  constructor(product: IProduct, id: number) {
    this.title = product.title;
    this.price = `$${product.price.toLocaleString('es-CL')}`;
    this.thumbnail = product.thumbnail;
    this.id = id;
  }
}

export default Product;
