import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createShoes, getCategories, getShoes } from '../service/api';
import { Validator } from '../utils/validator';


const AddPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        manufacturer: '',
        productionDate: '',
        importDate: '',
        categoryId: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const validate = async () => {
        const newErrors = {};

        if (!Validator.isRequired(formData.name)) newErrors.name = 'Shoes name is required';
        else if (!Validator.maxLength(formData.name, 100)) {
            newErrors.name = 'Shoes name must be <= 100 characters';
        }
        else {
            const res = await getShoes(formData.name, '', 0, 10000);
            const existingShoes = res.data.content || [];
            const isDuplicate = existingShoes.some(
                item => item.shoesName.toLowerCase() === formData.name.toLowerCase()
            );
            if (isDuplicate) newErrors.name = 'Shoes name already exists';
        }

        if (!Validator.isRequired(formData.price)) newErrors.price = 'Price is required';
        else {

            if (!Validator.isNumberInRange(formData.price, 0, 10000)) {
                newErrors.price = 'Price must be greater than 0 and less than 10000';
            }
            if (!Validator.maxLength(formData.price, 5)) {
                newErrors.price = 'Price length must be <= 5 digits';
            }
        }

        if (!Validator.isRequired(formData.manufacturer)) newErrors.manufacturer = 'Manufacturer is required';
        else if (!Validator.maxLength(formData.manufacturer, 100)) newErrors.manufacturer = 'Manufacturer must be <= 100 characters';

        if (!Validator.isRequired(formData.productionDate)) newErrors.productionDate = 'Production date is required';
        else if (!Validator.isDateFormat(formData.productionDate)) newErrors.productionDate = 'Production date format must be dd/MM/yyyy';

        if (!Validator.isRequired(formData.importDate)) newErrors.importDate = 'Import date is required';
        else if (!Validator.isDateFormat(formData.importDate)) newErrors.importDate = 'Import date format must be dd/MM/yyyy';

        if (!Validator.isRequired(formData.categoryId)) newErrors.categoryId = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        const isValid = await validate();
        if (!isValid) return;

        try {
            const dataToSubmit = {
                shoesName: formData.name,
                price: parseFloat(formData.price),
                quantity: 1,
                manufacturer: formData.manufacturer,
                productionDate: Validator.formatToISODate(formData.productionDate),
                importDate: formData.importDate ? Validator.formatToISODate(formData.importDate) : null,
                categoryId: parseInt(formData.categoryId)
            };

            await createShoes(dataToSubmit);
            setSuccessMessage('Created new shoes successfully');
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Failed to create new shoes or duplicate name');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container my-5">
            <h3>Add New Shoes</h3>
            {serverError && <Alert variant="danger">{serverError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={handleSubmit} className="mt-4">
                <Row className="mb-3">
                    <Col md={2} className="text-end">Shoes name:</Col>
                    <Col md={10}>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={2} className="text-end">Price:</Col>
                    <Col md={2}>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={2} className="text-end">Manufacture:</Col>
                    <Col md={10}>
                        <Form.Control
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            isInvalid={!!errors.manufacturer}
                        />
                        <Form.Control.Feedback type="invalid">{errors.manufacturer}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={2} className="text-end">Production Date</Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="productionDate"
                            placeholder="dd/MM/yyyy"
                            value={formData.productionDate}
                            onChange={handleChange}
                            isInvalid={!!errors.productionDate}
                        />
                        <Form.Control.Feedback type="invalid">{errors.productionDate}</Form.Control.Feedback>
                    </Col>
                    <Col md={2} className="text-end">Import Date</Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            name="importDate"
                            placeholder="dd/MM/yyyy"
                            value={formData.importDate}
                            onChange={handleChange}
                            isInvalid={!!errors.importDate}
                        />
                        <Form.Control.Feedback type="invalid">{errors.importDate}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={2} className="text-end">Category:</Col>
                    <Col md={4}>
                        <Form.Select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            isInvalid={!!errors.categoryId}
                        >
                            <option value="">---Select Category---</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col md={{ span: 10, offset: 2 }}>
                        <Button variant="primary" type="submit" className="me-2">Save</Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/')}>Back</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddPage;
