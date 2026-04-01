import { Form, Row, Col, Button } from 'react-bootstrap';

const CustomFilter = ({ categories, filters, onFilterChange, onSearch, onAdd }) => (
    <Form onSubmit={(e) => {
        e.preventDefault();
        onSearch();
    }} className="my-4">
        <Row className="align-items-center mb-3">
            <Col md={2}>Category:</Col>
            <Col md={4}>
                <Form.Select
                    value={filters.category}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                >
                    <option value="">--- All Categories ---</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                </Form.Select>
            </Col>
        </Row>
        <Row className="align-items-center">
            <Col md={2}>Shoes Name:</Col>
            <Col md={6}>
                <Form.Control
                    type="text"
                    placeholder="Enter name..."
                    value={filters.name}
                    onChange={(e) => onFilterChange('name', e.target.value)}
                />
            </Col>
            <Col md={4} className="d-flex gap-2">
                <Button type="submit" variant="primary">Filter</Button>
                <Button variant="outline-primary" onClick={onAdd}>Add New</Button>
            </Col>
        </Row>
    </Form>
);

export default CustomFilter;