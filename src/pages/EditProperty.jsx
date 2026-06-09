import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const EditProperty = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        const property = res.data.data;

        formik.setValues({
          title: property.title || "",
          description: property.description || "",
          price: property.price || "",
          propertyType: property.propertyType || "",
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          address: property.location?.address || "",
          city: property.location?.city || "",
          state: property.location?.state || "",
        });

        setExistingImages(property.images || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 7) {
      formik.setFieldError(
        "images",
        "You can only upload a maximum of 7 images",
      );
      return;
    }
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      address: "",
      city: "",
      state: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(5, "Title must be at least 5 characters")
        .required("Title is required"),
      description: Yup.string()
        .min(20, "Description must be at least 20 characters")
        .required("Description is required"),
      price: Yup.number()
        .min(1000, "Price must be at least ₦1,000")
        .required("Price is required"),
      propertyType: Yup.string().required("Please select a property type"),
      bedrooms: Yup.number()
        .min(1, "Must have at least 1 bedroom")
        .required("Bedrooms is required"),
      bathrooms: Yup.number()
        .min(1, "Must have at least 1 bathroom")
        .required("Bathrooms is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const data = new FormData();
        data.append("title", values.title);
        data.append("description", values.description);
        data.append("price", values.price);
        data.append("propertyType", values.propertyType);
        data.append("bedrooms", values.bedrooms);
        data.append("bathrooms", values.bathrooms);
        data.append("address", values.address);
        data.append("city", values.city);
        data.append("state", values.state);

        if (images.length > 0) {
          images.forEach((image) => data.append("images", image));
        }

        await API.put(`/properties/${id}`, data);
        navigate("/landlord-dashboard");
      } catch (err) {
        setErrors({
          submit: err.response?.data?.message || "Failed to update property",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading)
    return (
      <div className="text-center mt-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary)" }}
        ></div>
      </div>
    );

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div
          className="card p-4 shadow"
          style={{ borderRadius: "12px", border: "none" }}
        >
          <h3
            className="mb-4"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            Edit Property
          </h3>

          {formik.errors.submit && (
            <div className="alert alert-danger">{formik.errors.submit}</div>
          )}

          <form onSubmit={formik.handleSubmit}>
            {/* TITLE */}
            <div className="mb-3">
              <label className="form-label">Property Title</label>
              <input
                type="text"
                name="title"
                className={`form-control ${formik.touched.title && formik.errors.title ? "is-invalid" : ""}`}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="invalid-feedback">{formik.errors.title}</div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className={`form-control ${formik.touched.description && formik.errors.description ? "is-invalid" : ""}`}
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="invalid-feedback">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* PRICE & TYPE */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₦)</label>
                <input
                  type="number"
                  name="price"
                  className={`form-control ${formik.touched.price && formik.errors.price ? "is-invalid" : ""}`}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Property Type</label>
                <select
                  name="propertyType"
                  className={`form-select ${formik.touched.propertyType && formik.errors.propertyType ? "is-invalid" : ""}`}
                  value={formik.values.propertyType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">-- Select Type --</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="duplex">Duplex</option>
                  <option value="studio">Studio</option>
                  <option value="selfcon">Self Contain</option>
                </select>
                {formik.touched.propertyType && formik.errors.propertyType && (
                  <div className="invalid-feedback">
                    {formik.errors.propertyType}
                  </div>
                )}
              </div>
            </div>

            {/* BEDROOMS & BATHROOMS */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  className={`form-control ${formik.touched.bedrooms && formik.errors.bedrooms ? "is-invalid" : ""}`}
                  value={formik.values.bedrooms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bedrooms && formik.errors.bedrooms && (
                  <div className="invalid-feedback">
                    {formik.errors.bedrooms}
                  </div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  className={`form-control ${formik.touched.bathrooms && formik.errors.bathrooms ? "is-invalid" : ""}`}
                  value={formik.values.bathrooms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bathrooms && formik.errors.bathrooms && (
                  <div className="invalid-feedback">
                    {formik.errors.bathrooms}
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className={`form-control ${formik.touched.address && formik.errors.address ? "is-invalid" : ""}`}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="invalid-feedback">{formik.errors.address}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className={`form-control ${formik.touched.city && formik.errors.city ? "is-invalid" : ""}`}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="invalid-feedback">{formik.errors.city}</div>
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className={`form-control ${formik.touched.state && formik.errors.state ? "is-invalid" : ""}`}
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="invalid-feedback">{formik.errors.state}</div>
                )}
              </div>
            </div>

            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Current Images</label>
                <div className="d-flex gap-2 flex-wrap">
                  {existingImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`existing-${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid var(--primary)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* NEW IMAGE UPLOAD */}
            <div className="mb-3">
              <label className="form-label">
                Upload New Images (Max 7) — leave empty to keep current images
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={handleImages}
              />
            </div>

            {/* NEW IMAGE PREVIEWS */}
            {previews.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mb-3">
                {previews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid var(--accent)",
                    }}
                  />
                ))}
              </div>
            )}

            <div className="d-flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/landlord-dashboard")}
                className="btn w-50"
                style={{
                  border: "2px solid var(--primary)",
                  backgroundColor: "transparent",
                  color: "var(--primary)",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn w-50 d-flex align-items-center justify-content-center gap-2"
                disabled={formik.isSubmitting}
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--white)",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "500",
                }}
              >
                {formik.isSubmitting ? (
                  <FaSpinner className="spin" />
                ) : (
                  <FaUpload />
                )}
                {formik.isSubmitting ? "Updating..." : "Update Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
