import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';

import { Button, Card, Col, Container, Pagination, Row, Table } from 'react-bootstrap'

const TableList = ({ attribute, method, type }) => {
  const { data, pagingItems, pageRange, title, pageTitle, enableAdd, category } = attribute;
  const { handleOpenModal, handleDelete, loadData, handleFilter } = method;
  const { t } = useTranslation();

  useEffect(() => {
    loadData(1);
  }, [])

  return (
    <Container className={ type === "product" ? "mt-2" : "mt-4" }>
      <Card className="border-light bt-5px card-container">
        <Card.Header>
          <Row >
            <Col sm={ type === "product" ? 6 : 8 }>
              <Card.Title >{ pageTitle }</Card.Title>
            </Col>
            { type === "product" &&
              <Col sm={ 6 }>
                <Row className="justify-content-end">
                  <Col sm={ 9 } className='text-end'>
                    <Row className='align-items-center'>
                      <Col sm="5" className='pe-0 text-end'>
                        <span className='fw-bold'>{ t('category') }</span>
                      </Col>
                      <Col sm="7">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={ handleFilter }
                        >
                          <option value="all" selected>{ t('all') }</option>
                          { category.map((item, index) => {
                            return <option value={ item } key={ index }>{ item }</option>
                          }) }
                        </select>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={ 3 } className="text-end">
                    <Button
                      variant="light"
                      onClick={ (e) => handleOpenModal(e, "0") }
                    >
                      <i className="fas fa-plus"></i>
                      { t('add') }
                    </Button>
                  </Col>
                </Row>
              </Col>
            }
            { type === "account" && enableAdd &&
              <Col className="text-end">
                <Button
                  variant="light"
                  onClick={ (e) => handleOpenModal(e, "0") }
                >
                  <i className="fas fa-plus"></i>
                  { t('add') }
                </Button>
              </Col>
            }
          </Row>
        </Card.Header>
        <Card.Body className="card-body">
          <Table bordered responsive className='mb-0 border-light'>
            <thead className="table-primary border-light">
              <tr>
                <th className="text-center">#</th>
                { title?.map((item, index) => {
                  return <th key={ index } className="text-capitalize">{ item }</th>
                }) }
                <th style={ { width: "50px" } } ></th>
              </tr>
            </thead>
            <tbody>
              { data && data.map((item, index) => {
                if (index < pageRange.end && index >= pageRange.start) {
                  if (type === 'account') {
                    return (
                      <tr key={ index }>
                        <th className="text-center">{ index + 1 }</th>
                        <td className='text-capitalize'>{ `${item?.name?.lastname} ${item?.name?.firstname}` }</td>
                        <td>{ item?.phone }</td>
                        <td>{ item?.email }</td>
                        <td>{ item?.username }</td>
                        <td className='text-capitalize'>{ `${item?.address?.number}, ${item?.address?.street}, ${item?.address?.city}` }</td>
                        <td className="text-center d-flex justify-content-between align-items-center actions-col">
                          <a
                            href="#_"
                            onClick={ (e) => handleOpenModal(e, item["_id"]) }
                            className="me-1"
                          >
                            <i className="fas fa-edit"></i>
                          </a>
                          <a
                            href="#_"
                            onClick={ (e) => {
                              handleDelete(e, item["_id"])
                            } }
                          >
                            <i className="fas fa-trash-alt text-danger"></i></a>
                        </td>
                      </tr>
                    )
                  }
                  else if (type === 'product') {
                    return <tr key={ index } >
                      <th className="text-center" >{ index + 1 }</th>
                      <td className='text-capitalize'>{ item?.title }</td>
                      <td style={ { width: '100px' } }>{ item?.category }</td>
                      <td>{ item?.price }$</td>
                      <td className='description'>{ item?.description }</td>
                      <td >
                        <img src={ item?.image } alt="img" className=' p-3' style={ { width: '100px' } } />
                      </td>
                      <td className='text-center' style={ { width: '60px' } }>
                        <a
                          href="#_"
                          onClick={ (e) => handleOpenModal(e, item["_id"]) }
                          className="me-1 "
                        >
                          <i className="fas fa-edit"></i>
                        </a>
                        <a
                          href="#_"
                          onClick={ (e) => {
                            handleDelete(e, item["_id"])
                          } }
                        >
                          <i className="fas fa-trash-alt text-danger"></i></a>
                      </td>
                    </tr>
                  } else {
                    return null
                  }
                }
                return null
              }) }
            </tbody>
          </Table>
          <Pagination className='mt-3 mb-0 justify-content-end'>
            { pagingItems }
          </Pagination>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TableList
