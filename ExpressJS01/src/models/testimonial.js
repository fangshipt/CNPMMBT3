import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

testimonialSchema.index({ user: 1 }, { unique: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
