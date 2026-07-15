import cloudinary from "../lib/cloudinary.js";

export const deleteFromCloudinary = async (url) => {
  try {
    let resourceType = "image";
    if (url.includes("/image/")) resourceType = "image";
    if (url.includes("/video/")) resourceType = "video";

    const url_split = url.split("/");
    const filename = url_split[url_split.length - 1];
    const id = filename.split(".")[0];

    await cloudinary.uploader.destroy(id, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Error in cloudinary", error);
  }
};
