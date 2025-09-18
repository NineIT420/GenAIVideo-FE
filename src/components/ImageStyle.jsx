import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ImageStyle() {
  const formik = useFormik({
    initialValues: {
      number: "",
      imageOption: "",
      selectOption: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      number: Yup.number().required("Required").min(1, "Must be at least 1"),
      imageOption: Yup.string().required("Required"),
      selectOption: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Generated Data:", values);
    },
  });

  return (
    <div className="w-full h-full rounded-lg bg-white p-4 flex flex-col gap-4 mb-6">
      <div className="card-header">
        <h4 className="font-bold text-2xl">Image Style</h4>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full p-2 flex flex-col gap-6"
      >
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-semibold">
              Images per paragraph
            </label>
            <input
              type="number"
              name="number"
              placeholder="Images per paragraph"
              className="p-2 border rounded form-input"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.number && formik.errors.number && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.number}
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-semibold">Image style</label>
            <select
              name="imageOption"
              className="p-2 border rounded form-input"
              value={formik.values.imageOption}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select image style</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </select>
            {formik.touched.imageOption && formik.errors.imageOption && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.imageOption}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-stretch">
          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm font-semibold">Aspect ratio</label>
            <select
              name="selectOption"
              className="p-2 border rounded h-[48px] form-input"
              value={formik.values.selectOption}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Aspect ratio</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
            </select>
            {formik.touched.selectOption && formik.errors.selectOption && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.selectOption}
              </span>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <label className="mb-1 text-sm font-semibold">
              Prompt Field type
            </label>
            <textarea
              name="description"
              placeholder="Enter Prompt Field type"
              className="border rounded resize-none h-[48px] form-input"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <span className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end items-end">
          <button type="submit" className="btn btn-primary w-[150px]">
            Generate Image
          </button>
        </div>
      </form>
    </div>
  );
}
