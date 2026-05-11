import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: string): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: "apna-pehnoo",
    transformation: [
      { width: 800, height: 1000, crop: "fill", quality: "auto" },
    ],
  });
  return result.secure_url;
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
