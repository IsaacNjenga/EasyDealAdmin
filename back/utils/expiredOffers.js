import ProductsModel from "../models/Products.js";

export async function cleanupExpiredOffers() {
  await ProductsModel.updateMany(
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
}
