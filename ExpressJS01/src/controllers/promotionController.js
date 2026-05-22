import {
  getPromotionsService,
  createPromotionService,
  updatePromotionService,
  deletePromotionService,
} from "../services/promotionService.js";

export const getPromotions = async (req, res) => {
  const data = await getPromotionsService();
  return res.json(data);
};

export const createPromotion = async (req, res) => {
  const data = await createPromotionService(req.body);
  return res.status(data.EC === 0 ? 201 : 400).json(data);
};

export const updatePromotion = async (req, res) => {
  const data = await updatePromotionService(req.params.id, req.body);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const deletePromotion = async (req, res) => {
  const data = await deletePromotionService(req.params.id);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};
