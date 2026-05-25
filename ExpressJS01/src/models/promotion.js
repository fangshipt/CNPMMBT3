import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: { type: String, enum: ["percent", "fixed", "freeship"], required: true },
    value: { type: Number, default: 0, min: 0 },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Promotion = mongoose.model("Promotion", promotionSchema);
export default Promotion;
