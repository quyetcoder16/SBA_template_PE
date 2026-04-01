import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteModal = ({ show, target, onHide, onConfirm }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete Shoes "
                <strong className="ms-1 text-danger">{target?.shoesName}</strong>"?

            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onConfirm}>
                    Yes
                </Button>
                <Button variant="outline-secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;