import { CategoryService } from "../services/categoryService.js";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req, res) {
    const userId = req.userId;
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: "Name and color are required!" });
    }
    try {
      await categoryService.createNewCategory(name, color, userId);
      return res
        .status(201)
        .json({ message: "Category created successfully!" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const userId = req.userId;
    try {
      const categories = await categoryService.getCategories(userId);
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const userId = req.userId;
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({ error: "Missing category ID." });
    }
    try {
      await categoryService.deleteCategory(categoryId, userId);
      return res.status(200).json({ message: "Category deleted." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
