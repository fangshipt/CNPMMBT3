import {
  createProductService,
  deleteProductService,
  getProductsService,
  getProductByIdOrSlugService,
  updateProductService,
  getRelatedProductsService,
  updateProductStockService,
  getTopSellersService,
  getMostViewedService,
  canReviewService,
  addReviewService,
} from "../services/productService.js";

export const createProduct = async (req, res) => {
  const data = await createProductService(req.body);
  return res.status(data.EC === 0 ? 201 : 400).json(data);
};

export const getProducts = async (req, res) => {
  const data = await getProductsService(req.query);
  return res.status(data.EC === 0 ? 200 : 500).json(data);
};

export const getProductByIdOrSlug = async (req, res) => {
  const data = await getProductByIdOrSlugService(req.params.idOrSlug);
  return res.status(data.EC === 0 ? 200 : 404).json(data);
};

export const updateProduct = async (req, res) => {
  const data = await updateProductService(req.params.id, req.body);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const deleteProduct = async (req, res) => {
  const data = await deleteProductService(req.params.id);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const getRelatedProducts = async (req, res) => {
  const data = await getRelatedProductsService(req.params.id, req.query.limit);
  return res.status(data.EC === 0 ? 200 : 404).json(data);
};

export const updateProductStock = async (req, res) => {
  const { quantity } = req.body;
  const data = await updateProductStockService(req.params.id, quantity);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const getTopSellers = async (req, res) => {
  const data = await getTopSellersService(req.query.limit);
  return res.status(data.EC === 0 ? 200 : 500).json(data);
};

export const getMostViewed = async (req, res) => {
  const data = await getMostViewedService(req.query.limit);
  return res.status(data.EC === 0 ? 200 : 500).json(data);
};

export const canReview = async (req, res) => {
  if (!req.user) return res.json({ EC: 0, data: { canReview: false } });
  const data = await canReviewService(req.params.id, req.user._id);
  return res.json(data);
};

export const addReview = async (req, res) => {
  const data = await addReviewService(req.params.id, req.user._id, req.body);
  return res.status(data.EC === 0 ? 201 : 400).json(data);
};
