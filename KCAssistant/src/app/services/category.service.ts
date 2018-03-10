import { Injectable } from '@angular/core';
import { Category } from '../classes/productCategory';
import { MOCK_PRODUCTS } from '../classes/mock-products';
import { MOCK_Categories } from '../classes/mock-categories';
// to be removed, testing purpose only

@Injectable()
export class CategoryService {

  constructor() { }

  public getAllCategories(): Category[] {
    let categorylist: Category[];
    categorylist = new Array<Category>();

    for (const p of MOCK_Categories) {
      categorylist.push(p);
    }

    return categorylist;
  }

}
