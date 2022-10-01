import Product, { IProduct } from '../model/Product';

class Products {
  private Products: Product[] = [];

  private ID: number = 0;

  get GetProducts() {
    return [...this.Products];
  }

  private FindProduct(id: number) {
    return this.Products.findIndex((p) => p.id === id);
  }

  GetProductById(id: number) {
    return this.Products.find((p) => p.id === id) || { error: 'producto no encontrado' };
  }

  AddProduct(product: IProduct) {
    const newProduct = new Product(product, ++this.ID);
    this.Products.push(newProduct);
    return newProduct;
  }

  UpdateProduct(productUpdate: IProduct, id: number) {
    const productIndex = this.FindProduct(id);
    const { title, price, thumbnail } = productUpdate;
    if (productIndex === -1) return { error: 'producto no encontrado' };
    this.Products[productIndex] = {
      ...this.Products[productIndex],
      price: `$${price.toLocaleString('es-CL')}`,
      title,
      thumbnail,
    };
    return { success: 'producto actualizado' };
  }

  DeleteProductById(id: number) {
    const productIndex = this.FindProduct(id);
    if (productIndex === -1) return { error: 'producto no encontrado' };
    this.Products = this.Products.filter((p) => p.id !== id);
    return { success: 'producto eliminado' };
  }
}

const prods = new Products();

export default prods;
