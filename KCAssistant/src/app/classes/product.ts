import { Category } from '../classes/productCategory';

export class Product {
    id: number;
    name: string;
    category: Category;
    quantity: number;
    shortageQtyWarning: number;
    active: boolean;
    imgUrl:  string|any; // string; works ok 
    predictToBuy: number;

    constructor(id: number, name: string, category: Category, quantity: number, shortageQtyWarning: number) {
      this.id = 0;
      this.active = true;
      this.name = name;
      this.category = category;
      this.quantity = quantity;
      this.shortageQtyWarning = shortageQtyWarning;
      this.predictToBuy = (shortageQtyWarning - quantity) + 1;
    }
}
