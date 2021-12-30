import React from 'react'
import { Modal, Button } from 'react-bootstrap';

const ConfirmDialog = (props) => {

  const { show, id, title, data, type } = props.options;

  const handleClose = () => {
    props.cancel();
  }

  const hanldeOk = () => {
    if (type === 'delete') {
      props.onDelete(id);
    }
    if (type === 'edit') {
      props.onUpdate(id, data);
    }
  }

  return (
    <>
      <Modal
        show={ show }
        onHide={ handleClose }
        backdrop="static"
        keyboard="false"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { title }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ handleClose }>
            Close
          </Button>
          <Button className='modal-btn-color' onClick={ hanldeOk }>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ConfirmDialog
