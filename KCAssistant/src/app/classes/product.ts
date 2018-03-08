import { Category } from '../classes/productCategory';

export class Product {
    id: number;
    name: string;
    category: Category;
    quantity: number;
    shortageQtyWarning: number;
    active: boolean;
    imgUrl: string;

    constructor(id: number, name: string, category: Category, quantity: number, shortageQtyWarning: number) {
      this.id = 0;
      this.active = true;
      this.name = name;
      this.category = category;
      this.quantity = quantity;
      this.shortageQtyWarning = shortageQtyWarning;
    }

  }
