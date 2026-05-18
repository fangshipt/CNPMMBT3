import {
  createCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdOrSlugService,
  updateCategoryService,
} from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  const data = await createCategoryService(req.body);
  return res.status(data.EC === 0 ? 201 : 400).json(data);
};

export const getCategories = async (req, res) => {
  const data = await getCategoriesService(req.query);
  return res.status(data.EC === 0 ? 200 : 500).json(data);
};

export const getCategoryByIdOrSlug = async (req, res) => {
  const data = await getCategoryByIdOrSlugService(req.params.idOrSlug);
  return res.status(data.EC === 0 ? 200 : 404).json(data);
};

export const updateCategory = async (req, res) => {
  const data = await updateCategoryService(req.params.id, req.body);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const deleteCategory = async (req, res) => {
  const data = await deleteCategoryService(req.params.id);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};
