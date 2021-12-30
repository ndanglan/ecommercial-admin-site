import React from 'react'
import { Button, Modal, } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const ModalEdit = (props) => {
  const { t } = useTranslation();
  const { showModal, handleModalClose, submitHandler, sizeModal } = props
  return (
    <Modal size={ sizeModal } show={ showModal } onHide={ handleModalClose }>
      <Modal.Header closeButton>
        <Modal.Title className='text-capitalize'>{ `${t('titleInfomation')}` }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { props.children }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={ handleModalClose }>{ t('close') }</Button>
        { submitHandler &&
          <Button className='modal-btn-color' onClick={ submitHandler }>{ t('save') }</Button>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEdit
