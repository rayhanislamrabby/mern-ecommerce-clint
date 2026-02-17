import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecures";

const AddProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();

 const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;

  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    Swal.fire({
      title: "Confirm Publication",
      text: "Add this product to the store inventory?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      confirmButtonText: "Yes, Publish",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setUploading(true);
          // 1. Image Upload to ImgBB
          const formData = new FormData();
          formData.append("image", data.image[0]);
          const res = await axios.post(image_hosting_api, formData);

          if (res.data.success) {
            // 2. Prepare Data (Matching your JSON Structure)
            const productItem = {
              name: data.name,
              sku: data.sku,
              price: parseFloat(data.price),
              originalPrice: parseFloat(data.originalPrice),
              category: data.category,
              color: data.color,
              fabric: data.fabric,
              washCare: data.washCare,
              description: data.description,
              sizes: data.sizes,
              image: res.data.data.display_url,
              createdAt: new Date().toISOString(),
              sizeChart: data.sizes.reduce((acc, size) => {
                acc[size] = {
                  chest: data[`chest_${size}`] || 0,
                  length: data[`length_${size}`] || 0,
                };
                return acc;
              }, {}),
            };

            // 3. Post to Backend
            const productRes = await axiosSecure.post("/products", productItem);
            if (productRes.data.insertedId) {
              reset();
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Product Published Successfully",
              });
            }
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong!", "error");
        } finally {
          setUploading(false);
        }
      }
    });
  };

  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-black text-black uppercase tracking-tighter">
            Inventory Entry
          </h2>
          <p className="text-blue-800 font-bold text-xs mt-2 tracking-[0.3em]">
            MANAGE YOUR PRODUCT FEED
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-blue-50"
        >
          {/* Basic Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="form-control col-span-full">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Product Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="e.g. White Shirt #497"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                SKU Code
              </label>
              <input
                {...register("sku")}
                type="text"
                placeholder="SH-497"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Category
              </label>
              <select
                {...register("category")}
                className="select bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-black h-14 rounded-xl px-6"
              >
                <optgroup label="Men's Fashion">
                  <option value="Shirt">Shirt</option>
                  <option value="Pant">Pant</option>
                  <option value="Panjabi">Panjabi</option>
                  <option value="Watch">Watch</option>
                </optgroup>
                <optgroup label="Women's Fashion">
                  <option value="Saree">Saree</option>
                  <option value="Salwar Kameez">Salwar Kameez</option>
                </optgroup>
              </select>
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Sale Price (৳)
              </label>
              <input
                {...register("price")}
                type="number"
                placeholder="784"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Original Price (৳)
              </label>
              <input
                {...register("originalPrice")}
                type="number"
                placeholder="1116"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Color
              </label>
              <input
                {...register("color")}
                type="text"
                placeholder="White"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Fabric
              </label>
              <input
                {...register("fabric")}
                type="text"
                placeholder="Cotton Blend"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>

            <div className="form-control col-span-full">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Wash Care
              </label>
              <input
                {...register("washCare")}
                type="text"
                placeholder="Machine wash"
                className="input bg-white border-2 border-blue-800 focus:border-blue-600 text-black font-bold h-14 rounded-xl px-6"
                required
              />
            </div>
          </div>

          {/* Sizes & Dynamic Size Chart */}
          <div className="space-y-6">
            <label className="label text-black font-black uppercase text-xs mb-2">
              Available Sizes & Measurement
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  className="p-6 border-2 border-blue-800 rounded-2xl space-y-4"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("sizes")}
                      value={size}
                      className="checkbox checkbox-primary border-2 border-blue-800"
                    />
                    <span className="font-black text-black uppercase">
                      {size} Size
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      {...register(`chest_${size}`)}
                      type="number"
                      placeholder="Chest"
                      className="input input-sm border-2 border-blue-800 text-black font-bold"
                    />
                    <input
                      {...register(`length_${size}`)}
                      type="number"
                      placeholder="Length"
                      className="input input-sm border-2 border-blue-800 text-black font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Media */}
          <div className="space-y-8">
            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Product Image
              </label>
              <input
                {...register("image")}
                type="file"
                className="file-input w-full border-2 border-blue-800 bg-white text-black font-bold h-14 rounded-xl file:bg-blue-800 file:text-white file:border-none file:h-full file:px-6"
                required
              />
            </div>

            <div className="form-control">
              <label className="label text-black font-black uppercase text-xs mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                className="textarea border-2 border-blue-800 bg-white h-40 focus:border-blue-600 text-black font-medium text-lg p-6 rounded-2xl"
                placeholder="Describe the quality, fit, and style..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`btn w-full h-20 bg-blue-800 border-none text-white text-lg font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-900 shadow-2xl shadow-blue-200 transition-all active:scale-95`}
          >
            {uploading ? "PROCESSING..." : "PUBLISH TO STORE"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
