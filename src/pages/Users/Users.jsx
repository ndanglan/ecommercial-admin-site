import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { userServices } from '../../services';
import { usePagination } from '../../hooks';
import { ConfirmDialog, Input, ModalEdit, TableList } from '../../components';

const Users = () => {
  const { t } = useTranslation();
  const [{ pagingItems, data: users, pageRange, page }, setData] = usePagination([]);
  const [showModal, setModalShow] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState({});

  const formik = useFormik({
    initialValues: {
      id: '',
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      phone: '',
      email: '',
      city: '',
      street: '',
      number: '',
    },
    validationSchema: Yup.object({
      id: Yup.string().required(),
      firstname: Yup.string().required(`${t('formtype')}`),
      lastname: Yup.string().required(`${t('formtype')}`),
      phone: Yup.string().required(`${t('formtype')}`).min(10, `${t('formphone')}`),
      email: Yup.string().required(`${t('formtype')}`).email(`${t('formemail')}`),
      username: Yup.string().required(`${t('formtype')}`),
      password: Yup.string().required(`${t('formtype')}`).min(6, `${t('formpassword')}`),
      city: Yup.string().required(`${t('formtype')}`),
      street: Yup.string().required(`${t('formtype')}`),
      number: Yup.string().required(`${t('formtype')}`),
    }),
    onSubmit: (values) => {
      const newValues = {
        "email": values.email,
        "username": values.username,
        "password": values.password,
        "name": {
          "firstname": values.firstname,
          "lastname": values.lastname
        },
        "address": {
          "city": values.city,
          "street": values.street,
          "number": +values.number,
        },
        "phone": values.phone,
      }
      handleSave(values.id, newValues);
    }
  })

  const handleModalClose = () => {
    formik.resetForm();
    setModalShow(false);
  }
  const handleModalShow = () => setModalShow(true);

  const loadData = (page) => {
    userServices.list().then(res => {
      const newResponse = res.filter(item => {
        return item.role === 'user'
      })

      if (newResponse.length < pageRange.start + 1 && page !== 1) {
        setData(newResponse, page - 1);
        return;
      }

      if (newResponse.length > pageRange.end && page !== 1) {
        setData(newResponse, page + 1);
        return;
      }
      setData(newResponse, page);
    })
  }

  const handleOpenModal = (e, id) => {
    e.preventDefault();
    if (id !== "0") {
      userServices.getSingle(id).then(res => {
        formik.setFieldValue('firstname', res.name.firstname)
        formik.setFieldValue('lastname', res.name.lastname)
        formik.setFieldValue('email', res.email)
        formik.setFieldValue('phone', res.phone)
        formik.setFieldValue('username', res.username)
        formik.setFieldValue('password', res.password)
        formik.setFieldValue('city', res.address.city)
        formik.setFieldValue('street', res.address.street)
        formik.setFieldValue('number', res.address.number)
        formik.setFieldValue('id', res["_id"])

        handleModalShow();
      })
    }
    else if (id === "0") {
      formik.resetForm();
      handleModalShow();
    }
  }

  const handleSave = (id, data) => {
    setConfirmOptions({
      ...confirmOptions,
      show: true,
      title: t('confirmChangeQues'),
      type: 'edit',
      data: data,
      id: id,
    })
    handleModalClose();
  }

  const hanldeUpdate = (id, data) => {
    setConfirmOptions({
      show: false,
    })
    userServices.updateUser(id, data).then(res => {
      if (res.success) {
        toast.success(t('confirmsuccess'), {
          onClose: () => loadData(page)
        });
      }
    }).catch(err => {
      toast.error(t('confirmerror'));
    })
  }

  const handleDelete = (e, id) => {
    e.preventDefault();
    setConfirmOptions({
      ...confirmOptions,
      show: true,
      title: t('confirmChangeQues'),
      type: 'delete',
      id: id,
    })
  }

  const confirmDelete = (id) => {
    setConfirmOptions({
      show: false
    })
    userServices.deleteUser(id).then(res => {
      if (res.success) {
        toast.success(t('confirmsuccess'), {
          onClose: () => loadData(page)
        });
      }
    }).catch(err => {
      toast.error(t('confirmerror'));
    })
  }

  const cancel = () => {
    setConfirmOptions({
      show: false
    })
  }

  const method = {
    handleOpenModal,
    handleDelete,
    loadData
  }

  const attribute = {
    pageTitle: t('userAccount'),
    enableAdd: false,
    pagingItems,
    data: users,
    pageRange,
    title: [
      t('fullname'),
      t('phone'),
      t('email'),
      t('username'),
      t('address'),
    ]
  }

  return (
    <>
      <TableList method={ method } attribute={ attribute } type="account" />
      <ModalEdit showModal={ showModal } handleModalClose={ handleModalClose } submitHandler={ formik.handleSubmit } sizeModal="lg">
        <form>
          <div className="row mb-3">
            <label
              htmlFor="txtLastName"
              className="col-sm-3 col-form-label required">
              { t('fullname') }
            </label>
            <div className="col-sm">
              <input
                type="text" className="form-control"
                id="txtLastName"
                placeholder={ t('lastname') }
                name='lastname'
                { ...formik.getFieldProps('lastname') }
              />
              { formik.touched.lastname && formik.errors.lastname ? <div className='invalid-feedback'>{ formik.errors.lastname }</div> : "" }
            </div>
            <div className="col-sm">
              <input
                type="text"
                className="form-control"
                id="txtFirstName"
                placeholder={ t('firstname') }
                name='firstname'
                { ...formik.getFieldProps('firstname') }
              />
              { formik.touched.firstname && formik.errors.firstname ? <div className='invalid-feedback'>{ formik.errors.firstname }</div> : "" }
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="txtAddress"
              className="col-sm-3 col-form-label required">
              { t('address') }
            </label>
            <div className="col-sm-9">
              <div className="row mb-3 d-flex justify-content-center">
                <div className="col-sm-6 col-lg-6">
                  <label
                    htmlFor="txtCity"
                    className="row mb-1 ms-0">
                    { t('city') }
                  </label>
                  <input
                    type="text" className="row form-control ms-0"
                    id="txtCity"
                    placeholder={ t('city') }
                    name='city'
                    { ...formik.getFieldProps('city') }
                  />
                  { formik.touched.city && formik.errors.city ? <div className='invalid-feedback'>{ formik.errors.city }</div> : "" }
                </div>
                <div className="col-sm-6 col-lg-6">
                  <label
                    htmlFor="txtStreet"
                    className="row mb-1 ms-0">
                    { t('street') }
                  </label>
                  <input
                    type="text" className=" row form-control ms-0"
                    id="txtStreet"
                    placeholder={ t('street') }
                    name='street'
                    { ...formik.getFieldProps('street') }
                  />
                  { formik.touched.street && formik.errors.street ? <div className='invalid-feedback'>{ formik.errors.street }</div> : "" }
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-6 col-lg-6">
                  <label
                    htmlFor="txtNumber"
                    className="row mb-1 ms-0">
                    { t('number') }
                  </label>
                  <input
                    type="text" className="row form-control ms-0"
                    id="txtNumber"
                    placeholder={ t('number') }
                    name='number'
                    { ...formik.getFieldProps('number') }
                  />
                  { formik.touched.number && formik.errors.number ? <div className='invalid-feedback'>{ formik.errors.number }</div> : "" }
                </div>
              </div>
            </div>
          </div>
          <Input
            type="tel"
            id="txtPhone"
            placeholder={ t('phone') }
            labelSize='3'
            label={ t('phone') }
            name="phone"
            frmField={ formik.getFieldProps('phone') }
            err={ formik.touched.phone && formik.errors.phone }
            errMessage={ formik.errors.phone }
          />
          <Input
            type="email"
            id="txtEmail"
            placeholder="Email"
            labelSize='3'
            label='Email'
            name="email"
            frmField={ formik.getFieldProps('email') }
            err={ formik.touched.email && formik.errors.email }
            errMessage={ formik.errors.email }
          />
          <Input
            type="text"
            id="txtUserName"
            placeholder={ t('username') }
            labelSize='3'
            label={ t('username') }
            name="username"
            frmField={ formik.getFieldProps('username') }
            err={ formik.touched.username && formik.errors.username }
            errMessage={ formik.errors.username }
          />
          <Input
            type="text"
            id="txtPassword"
            placeholder={ t('password') }
            labelSize='3'
            label={ t('password') }
            name="password"
            frmField={ formik.getFieldProps('password') }
            err={ formik.touched.password && formik.errors.password }
            errMessage={ formik.errors.password }
          />
        </form>
      </ModalEdit>
      <ConfirmDialog options={ confirmOptions }
        onDelete={ confirmDelete } cancel={ cancel }
        onUpdate={ hanldeUpdate } />
    </>
  )
}

export default Users
