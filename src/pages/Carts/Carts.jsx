import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  api,
  cartsServices,
  productsServices,
  userServices,
} from "../../services";
import { usePagination } from "../../hooks";
import { ConfirmDialog, ModalEdit } from "../../components";

const Carts = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [detailCart, setDetailCart] = useState({});
  const [showModal, setModalShow] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState({});
  const [{ pagingItems, data: carts, pageRange, page }, setData] =
    usePagination([]);

  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  const formatDate = (date) => {
    const D = new Date(date);
    const neededDate = `${
      +D.getDate() < 10 ? "0" + D.getDate() : D.getDate()
    }-${
      D.getMonth() + 1 < 10 ? "0" + (D.getMonth() + 1) : D.getMonth() + 1
    }-${D.getFullYear()}`;

    return neededDate;
  };

  const takeUserInfo = (data) => {
    return {
      ...data,
      name: data.name.firstname + " " + data.name.lastname,
      address: `${data.address.number}, ${data.address.street}, ${data.address.city}`,
    };
  };

  const takeProductsInfo = (data, products) => {
    if (data) {
      return data.map((singleData) => {
        const specificProduct = products.filter(
          (item) => item["_id"] === singleData.productId
        );
        return {
          ...specificProduct[0],
          quantity: singleData.quantity,
        };
      });
    }
  };

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    return totalPrice;
  };

  const loadData = (page) => {
    const cartReq = cartsServices.list();
    const userReq = userServices.list();
    const productReq = productsServices.list();

    api.promise([cartReq, userReq, productReq]).then(
      api.spread((...res) => {
        if (res[0].carts.length < pageRange.start + 1 && page !== 1) {
          setData(res[0].carts, page - 1);
          return;
        }

        if (res[0].carts.length > pageRange.end && page !== 1) {
          setData(res[0].carts, page + 1);
          return;
        }
        setData(res[0].carts, page);
        setUsers(res[1]);
        setProducts(res[2]);
      })
    );
  };

  const filterUserCart = (e) => {
    if (e.target.value !== "All") {
      cartsServices.getUserCarts(e.target.value).then((res) => {
        if (res.success) {
          setData([res.cart], 1);
        } else {
          setData([], 1);
        }
      });
    } else {
      cartsServices.list().then((res) => {
        setData(res.carts, 1);
      });
    }
  };

  const handleOpenModal = (e, id) => {
    e.preventDefault();
    let userInfo = {};
    let products = [];
    let date = undefined;
    let cartId = undefined;
    let totalPrice = 0;
    if (id) {
      cartsServices.getSingle(id).then((cart) => {
        const userReq = userServices.getSingle(cart?.cart?.userId);
        const productReq = productsServices.list();

        date = formatDate(cart?.cart?.createdAt);
        cartId = cart.cart["_id"];

        api.promise([userReq, productReq]).then(
          api.spread((...res) => {
            // take userInfo of single Cart
            userInfo = takeUserInfo(res[0]);

            // take single product in products in a cart
            products = takeProductsInfo(cart.cart.products, res[1]);

            totalPrice = calculateTotalPrice(products);

            setDetailCart({
              date: date,
              id: cartId,
              userInfo: userInfo,
              products: products,
              totalPrice: totalPrice,
            });
            handleModalShow();
          })
        );
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
      cartsServices
        .remove(id)
        .then((res) => {
          if (res.message === "delete completed") {
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

  const cancel = () => {
    setConfirmOptions({
      show: false,
    });
  };

  useEffect(() => {
    loadData(1);
  }, []);

  return (
    <>
      <Container className="mt-4">
        <Card className="border-light bt-5px card-container">
          <Card.Header>
            <Row>
              <Col xs="6">
                <Card.Title>{t("carts")}</Card.Title>
              </Col>
              <Col xs="6">
                <Row className="justify-content-end">
                  <Col xs="7">
                    <Row className="align-items-center ">
                      <Col xs="4" className="pe-0 text-end">
                        <span className="fw-bold">{t("userId")}</span>
                      </Col>
                      <Col xs="8">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => filterUserCart(e)}
                        >
                          <option key="all"> {t("all")}</option>
                          {users.map((item, index) => {
                            return (
                              <option value={item["_id"]} key={index}>
                                {" "}
                                {item["_id"]}
                              </option>
                            );
                          })}
                        </select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body className="card-body">
            <Table bordered responsive className="mb-0 border-light">
              <thead className="table-primary border-light">
                <tr>
                  <th style={{ width: "30px" }} className="text-center">
                    #
                  </th>
                  <th>{t("userId")}</th>
                  <th>{t("code")}</th>
                  <th className="text-capitalize">{t("date")}</th>
                  <th className="text-capitalize">{t("totalProduct")}</th>
                  <th className="text-capitalize">{t("totalOrder")}</th>
                  <th style={{ width: "60px" }}></th>
                </tr>
              </thead>
              <tbody className="border-light">
                {carts[0] &&
                  carts.map((cart, index) => {
                    if (index < pageRange.end && index >= pageRange.start) {
                      let totalProducts = 0;
                      let totalPrice = 0;

                      const needDate = formatDate(cart?.createdAt);

                      const productsInfo = takeProductsInfo(
                        cart?.products,
                        products
                      );

                      totalPrice = calculateTotalPrice(productsInfo);

                      productsInfo.forEach((item) => {
                        totalProducts += item?.quantity;
                      });

                      const renderFormat = {
                        id: cart["_id"],
                        userId: cart?.userId,
                        date: needDate,
                        totalProducts: totalProducts,
                        totalPrice: totalPrice,
                      };

                      return (
                        <tr key={index}>
                          <th className="text-center">{index + 1}</th>
                          <td>{renderFormat.userId}</td>
                          <td className="text-capitalize">{renderFormat.id}</td>
                          <td>{renderFormat.date}</td>
                          <td>{renderFormat.totalProducts}</td>
                          <td>{renderFormat.totalPrice.toFixed(2)}$</td>
                          <td className="text-center  h-100">
                            <a
                              href="#_"
                              onClick={(e) =>
                                handleOpenModal(e, renderFormat.id)
                              }
                              className="me-1"
                            >
                              <i className="fas fa-info-circle"></i>
                            </a>
                            <a
                              href="#_"
                              onClick={(e) => {
                                handleDelete(e, renderFormat.id);
                              }}
                            >
                              <i className="fas fa-trash-alt text-danger"></i>
                            </a>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
              </tbody>
            </Table>
            <Pagination className="mt-3 mb-0 justify-content-end">
              {pagingItems}
            </Pagination>
          </Card.Body>
        </Card>
      </Container>
      <ModalEdit
        showModal={showModal}
        handleModalClose={handleModalClose}
        sizeModal="lg"
      >
        {detailCart && (
          <>
            <div className="row mb-3">
              <p className="col-sm-3 text-capitalize fw-bold">
                {t("clientName") + " :"}
              </p>
              <p className="col-sm text-capitalize">
                {detailCart?.userInfo?.name}
              </p>
            </div>
            <div className="row mb-3">
              <p className="col-sm-3 text-capitalize fw-bold">
                {t("address") + " :"}
              </p>
              <p className="col-sm text-capitalize">
                {detailCart?.userInfo?.address}
              </p>
            </div>
            <div className="row mb-3">
              <p className="col-sm-3 text-capitalize fw-bold">
                {t("phone") + " :"}
              </p>
              <p className="col-sm text-capitalize">
                {detailCart?.userInfo?.phone}
              </p>
            </div>
            <div className="row mb-3">
              <p className="col-sm-3 text-capitalize fw-bold">
                {t("date") + " :"}
              </p>
              <p className="col-sm text-capitalize">{detailCart?.date}</p>
            </div>
            <div className="row mb-3 ">
              <p className="col-sm-3 text-capitalize fw-bold ">
                {t("products") + " :"}
              </p>
              <p className="col-sm text-capitalize">
                {detailCart?.products?.length !== 0 &&
                  detailCart?.products?.map((item, index) => {
                    return (
                      <div className="row mb-3 border-bottom" key={index}>
                        <div className="col-sm-6">
                          <p>
                            {" "}
                            <span className="fst-italic fw-bold">
                              Title:
                            </span>{" "}
                            {item.title}
                          </p>
                          <p>
                            <span className="fst-italic fw-bold">
                              Quantity:
                            </span>{" "}
                            {item.quantity}
                          </p>
                          <p>
                            <span className="fst-italic fw-bold">
                              Total Price:
                            </span>{" "}
                            {(item.quantity * item.price).toFixed(2)}$
                          </p>
                        </div>
                        <div className="col-sm-6">
                          <img
                            src={item.image}
                            alt="img"
                            className="img-thumbnail"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </p>
            </div>
            <div className="row mb-3">
              <p className="col-sm-3 text-capitalize fw-bold ">
                {t("totalPrice") + " :"}
              </p>
              <p className="col-sm text-capitalize">
                {detailCart?.totalPrice?.toFixed(2)}$
              </p>
            </div>
          </>
        )}
      </ModalEdit>
      <ConfirmDialog
        options={confirmOptions}
        cancel={cancel}
        onDelete={confirmDelete}
      />
    </>
  );
};

export default Carts;
