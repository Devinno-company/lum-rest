import db from "../database/connection";
import Category from "../models/Category";

class CategoryRepository {
    
    public static async findCategoryByName(category: string): Promise<Category> {

        return new Promise(async (resolve) => {
            const searchCategory = await db('tb_category as c')
                .select('*')
                .where('c.nm_category', '=', category);

            resolve(searchCategory[0]);
        });
    }

    public static async findCategoryById(idCategory: string): Promise<Category> {

        return new Promise(async (resolve) => {
            const searchCategory = await db('tb_category as c')
                .select('*')
                .where('c.sg_category', '=', idCategory);

            resolve(searchCategory[0]);
        });
    }
}

export default CategoryRepository;