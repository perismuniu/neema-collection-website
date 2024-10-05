import multer, { memoryStorage } from "multer";
import { v2 } from "cloudinary";

// Configure Cloudinary
v2.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = memoryStorage();
export const upload = multer({ storage });


export const imageUpload = async (req:any, res:any) => {
    try {
      const promises = req.files.map((file: any) => {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        return handleUpload(dataURI);
      });
      const results = await Promise.all(promises);
      res.send(results);
    } catch (error) {
      res.status(500).send({ message: "Error uploading files" });
    }
  }
const handleUpload = async (file: any) => {
  try {
    const result = await v2.uploader.upload(file, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const cleanupImages = async (req: any, res: any) => {
  const { urls } = req.body;
  
  try {
    const deletePromises = urls.map((url: string) => {
      // Extract public_id from the Cloudinary URL
      const publicId = url.split('/').pop()?.split('.')[0];
      if (!publicId) throw new Error('Invalid URL');
      
      return v2.uploader.destroy(publicId);
    });
    
    await Promise.all(deletePromises);
    res.status(200).json({ message: 'Images cleaned up successfully' });
  } catch (error) {
    console.error('Error cleaning up images:', error);
    res.status(500).json({ message: 'Error cleaning up images' });
  }
};