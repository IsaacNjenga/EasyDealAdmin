import ProductsModel from "../models/Products.js";

export async function cleanupExpiredOffers() {
  try {
    const result = await ProductsModel.updateMany(
      {
        discountAvailable: true,
        offerEndDate: { $lte: new Date() },
      },
      {
        $set: {
          discountAvailable: false,
          discount: null,
          offerStartDate: null,
          offerEndDate: null,
        },
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`✓ Cleaned up ${result.modifiedCount} expired offer(s)`);
    }
    
    return result;
  } catch (error) {
    console.error("Error cleaning up expired offers:", error);
    throw error;
  }
}