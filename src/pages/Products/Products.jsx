import React, { useState, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

import { productsServices } from "../../services";
import { usePagination } from "../../hooks";
import { ConfirmDialog, Input, ModalEdit, TableList } from "../../components";

const Products = () => {
  const { t } = useTranslation();
  const [{ pagingItems, data: products, pageRange, page }, setData] =
    usePagination([]);
  const [category, setCategory] = useState([]);
  const [showModal, setModalShow] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState({});
  const defaultImgUrl =
    "https://restfulapi.dnd-group.net/public/photo-icon.png";
  const fileRef = useRef();
  const [previewImage, setPreviewImage] = useState();

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      price: "",
      category: "",
      description: "",
      image: undefined,
    },
    validationSchema: Yup.object({
      id: Yup.string().required(),
      title: Yup.string().required(`${t("formtype")}`),
      price: Yup.string().required(`${t("formtype")}`),
      category: Yup.string().required(`${t("formtype")}`),
      description: Yup.string().required(`${t("formtype")}`),
    }),
    onSubmit: (values) => {
      const { id, ...others } = values;

      const newValue = {
        ...others,
        price: +values.price,
      };

      handleSave(id, newValue);
    },
  });

  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  const loadData = (page) => {
    productsServices.list().then((res) => {
      if (res.length < pageRange.start + 1 && page !== 1) {
        setData(res, page - 1);
        return;
      }

      if (res.length > pageRange.end && page !== 1) {
        setData(res, page + 1);
        return;
      }

      setData(res, page);

      let categories = [];
      res.forEach((item) => {
        const existingCategory = categories.find(
          (category) => category === item.category
        );

        if (!existingCategory) {
          categories = [...categories, item.category];
        }
      });
      setCategory(categories);
    });
  };

  const handleOpenModal = (e, id) => {
    e.preventDefault();
    if (id !== "0") {
      productsServices.getSingle(id)
        .then((res) => {
          formik.setFieldValue("title", res.title);
          formik.setFieldValue("price", res.price);
          formik.setFieldValue("category", res.category);
          formik.setFieldValue("description", res.description);
          formik.setFieldValue("id", res["_id"]);

          if (res.image) {
            setPreviewImage(res.image);
          } else {
            setPreviewImage(defaultImgUrl);
          }

          handleModalShow();
        })
        .catch(err => {
          console.log(err);
        })
    } else if (id === "0") {
      formik.resetForm();
      setPreviewImage(defaultImgUrl);
      handleModalShow();
    }
  };

  const handleSave = (id, data) => {
    setConfirmOptions({
      ...confirmOptions,
      show: true,
      title: t("confirmChangeQues"),
      type: "edit",
      data: data,
      id: id,
    });
    handleModalClose();
  };

  const hanldeUpdate = (id, data) => {
    setConfirmOptions({
      show: false,
    });
    if (id !== 0) {
      productsServices
        .update(id, data)
        .then((res) => {
          toast.success(t("confirmsuccess"), {
            onClose: () => loadData(page),
          });
        })
        .catch((err) => {
          toast.error(t("confirmerror"));
        });
    } else if (id === 0) {
      productsServices
        .add(data)
        .then((res) => {
          if (res.message === "add compelte") {
            toast.success(t("confirmsuccess"), {
              onClose: () => loadData(page),
            });
          }
        })
        .catch((err) => {
          toast.error(t("confirmerror"));
        });
    }
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    setConfirmOptions({
      ...confirmOptions,
      show: true,
      title: t("confirmChangeQues"),
      type: "delete",
      id: id,
    });
  };

  const confirmDelete = (id) => {
    setConfirmOptions({
      show: false,
    });

    if (id) {
      productsServices
        .deleteProduct(id)
        .then((res) => {
          if (res.success) {
            toast.success(t("confirmsuccess"), {
              onClose: () => loadData(page),
            });
          }
        })
        .catch((err) => {
          toast.error(t("confirmerror"));
        });
    }
  };

  const handleFilter = (e) => {
    if (e.target.value === "all") {
      productsServices.list().then((res) => {
        setData(res, 1);
      });
    } else {
      productsServices.getSpecificCategory(e.target.value).then((res) => {
        setData(res, 1);
      });
    }
  };

  const cancel = () => {
    setConfirmOptions({
      show: false,
    });
  };

  const method = {
    handleOpenModal,
    handleDelete,
    loadData,
    handleFilter,
  };

  const attribute = {
    pageTitle: t("products"),
    enableAdd: true,
    pagingItems,
    data: products,
    pageRange,
    title: [
      t("title"),
      t("category"),
      t("price"),
      t("description"),
      t("image"),
    ],
    category,
  };

  return (
    <>
      <TableList method={ method } attribute={ attribute } type="product" />
      <ModalEdit
        showModal={ showModal }
        handleModalClose={ handleModalClose }
        submitHandler={ formik.handleSubmit }
        sizeModal="xl"
      >
        <Row>
          <Col sm={ 8 }>
            <form>
              <Input
                type="text"
                id="txtTitle"
                placeholder={ t("title") }
                labelSize="3"
                label={ t("title") }
                name="title"
                frmField={ formik.getFieldProps("title") }
                err={ formik.touched.title && formik.errors.title }
                errMessage={ formik.errors.title }
              />
              <Input
                type="text"
                id="txtPrice"
                placeholder={ t("price") }
                labelSize="3"
                label={ t("price") }
                name="price"
                frmField={ formik.getFieldProps("price") }
                err={ formik.touched.price && formik.errors.price }
                errMessage={ formik.errors.price }
              />
              <Input
                type="text"
                id="txtCategory"
                placeholder={ t("category") }
                labelSize="3"
                label={ t("category") }
                name="category"
                frmField={ formik.getFieldProps("category") }
                err={ formik.touched.category && formik.errors.category }
                errMessage={ formik.errors.category }
              />
              <Input
                type="text"
                id="txtDescription"
                placeholder={ t("description") }
                labelSize="3"
                label={ t("description") }
                name="description"
                frmField={ formik.getFieldProps("description") }
                err={ formik.touched.description && formik.errors.description }
                errMessage={ formik.errors.description }
              />
              <Input
                type="file"
                id="txtImage"
                placeholder={ t("image") }
                labelSize="3"
                label={ t("image") }
                name="image"
                ref={ fileRef }
                accept="image/*"
                onChange={ (e) => {
                  if (e.target.files && e.target.files[0]) {
                    formik.setFieldValue("image", e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }
                } }
              />
            </form>
          </Col>
          <Col sm={ 4 } className="text-center">
            <img
              src={ previewImage }
              alt="img"
              className="img-thumbnail border-primary d-block"
            />
          </Col>
        </Row>
      </ModalEdit>
      <ConfirmDialog
        options={ confirmOptions }
        onDelete={ confirmDelete }
        cancel={ cancel }
        onUpdate={ hanldeUpdate }
      />
    </>
  );
};

export default Products;
