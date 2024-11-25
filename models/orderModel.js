import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
        },
        foods: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'food',
                    required: true,
                },
                quantity: { type: Number, required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model('order', orderSchema);