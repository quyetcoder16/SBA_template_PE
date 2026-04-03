import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import { Validator } from '../utils/validator';

const ComprehensiveForm = () => {
    // 1. Khởi tạo State cho tất cả các loại field
    const [formData, setFormData] = useState({
        username: '',
        bio: '',             // Textarea
        gender: 'male',      // Radio
        skills: [],          // Checkbox (Multi-select)
        city: '',            // Select
        isAgreed: false,     // Single Checkbox
        avatar: null         // File
    });

    const [errors, setErrors] = useState({});

    // 2. Hàm handleChange "Vạn năng"
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            // Trường hợp Single Checkbox (như Terms and Conditions)
            if (name === 'isAgreed') {
                setFormData(prev => ({ ...prev, [name]: checked }));
            }
            // Trường hợp Multi Checkbox (như Skills)
            else {
                const updatedSkills = checked
                    ? [...formData.skills, value]
                    : formData.skills.filter(s => s !== value);
                setFormData(prev => ({ ...prev, skills: updatedSkills }));
            }
        }
        else if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
        else {
            // Radio, Select, Text, Textarea
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Xóa lỗi khi người dùng bắt đầu sửa lại field đó
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // 3. Hàm Validate
    const validate = () => {
        const newErrors = {};

        if (!Validator.isRequired(formData.username)) newErrors.username = 'Username is required';

        if (!Validator.isRequired(formData.bio)) newErrors.bio = 'Bio is required';
        else if (!Validator.maxLength(formData.bio, 200)) newErrors.bio = 'Bio must be < 200 chars';

        if (formData.skills.length === 0) newErrors.skills = 'Please select at least one skill';

        if (!formData.city) newErrors.city = 'Please select a city';

        if (!formData.isAgreed) newErrors.isAgreed = 'You must agree to terms';

        if (!formData.avatar) newErrors.avatar = 'Please upload an image';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Data to Submit:", formData);
            alert("Form Submitted Successfully!");
        }
    };

    return (
        <Container className="my-5 p-4 border rounded bg-light">
            <h2 className="mb-4">Full Input Example</h2>
            <Form onSubmit={handleSubmit}>

                {/* TEXT INPUT */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Username</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                {/* TEXTAREA */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Bio</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            isInvalid={!!errors.bio}
                        />
                        <Form.Control.Feedback type="invalid">{errors.bio}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                {/* RADIO BUTTONS */}
                <fieldset className="mb-3">
                    <Row>
                        <Form.Label column sm={2}>Gender</Form.Label>
                        <Col sm={10}>
                            <Form.Check
                                type="radio" label="Male" name="gender" value="male"
                                checked={formData.gender === 'male'} onChange={handleChange}
                            />
                            <Form.Check
                                type="radio" label="Female" name="gender" value="female"
                                checked={formData.gender === 'female'} onChange={handleChange}
                            />
                        </Col>
                    </Row>
                </fieldset>

                {/* MULTI CHECKBOXES */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Skills</Form.Label>
                    <Col sm={10}>
                        <Form.Check inline label="React" value="react" type="checkbox" name="skills" onChange={handleChange} />
                        <Form.Check inline label="Java" value="java" type="checkbox" name="skills" onChange={handleChange} />
                        <Form.Check inline label="SQL" value="sql" type="checkbox" name="skills" onChange={handleChange} />
                        {errors.skills && <div className="text-danger small">{errors.skills}</div>}
                    </Col>
                </Form.Group>

                {/* FILE INPUT */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Avatar</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="file" name="avatar" onChange={handleChange} isInvalid={!!errors.avatar} />
                        <Form.Control.Feedback type="invalid">{errors.avatar}</Form.Control.Feedback>
                    </Col>
                </Form.Group>

                {/* SINGLE CHECKBOX (AGREEMENT) */}
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="isAgreed"
                        label="I agree to terms and conditions"
                        onChange={handleChange}
                        isInvalid={!!errors.isAgreed}
                    />
                    {errors.isAgreed && <div className="text-danger small">{errors.isAgreed}</div>}
                </Form.Group>

                <Button type="submit" variant="success">Submit All</Button>
            </Form>
        </Container>
    );
};

export default ComprehensiveForm;