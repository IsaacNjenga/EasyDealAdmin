import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: [String], required: true },
        colour: { type: [String], required: true },
        type: { type: String, required: true },
        category: { type: String, required: true },
        freeShipping: { type: Boolean, required: true },
        available: { type: Boolean, required: true },
        stockCount: { type: Number, required: true },
        material: { type: String, required: true },
        dimensions: { type: String, required: true },
        rating: { type: Number, required: true },
        totalReviews: { type: Number, required: true },
        shippingInformation: { type: [String], required: true },
        careGuide: { type: String, required: true },
        tags: { type: [String], required: true },
        discount: { type: Number, required: true },
    },
    { collection: 'products', timestamps: true }
)

const ProductsModel = mongoose.model('products', productSchema)
export default ProductsModel