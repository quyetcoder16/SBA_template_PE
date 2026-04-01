import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShoesById } from "../service/api";
import { Button, Col, Container, Row } from "react-bootstrap";

const PageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shoes, setShoes] = useState(null);

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const res = await getShoesById(id);
                setShoes(res.data);
            } catch (error) {
                console.error('Error fetching shoes detail:', error);
            }
        };
        fetchShoes();
    }, [id]);

    // Hàm định dạng ngày tháng (nếu dữ liệu trả về là ISO string)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN'); // Trả về dd/mm/yyyy
    };

    if (!shoes) return <div className="text-center mt-5">Shoes not found</div>;

    return (
        <Container className="my-5">
            <h2 className="mb-5 text-uppercase fw-bold">VIEW DETAILS</h2>

            <div className="detail-content px-4">
                {/* Mỗi dòng gồm 2 cột: Label (6) và Value (6) */}
                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Shoes Name:</Col>
                    <Col xs={6} className="ps-4">{shoes.shoesName}</Col>
                </Row>

                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Manufacturer:</Col>
                    <Col xs={6} className="ps-4">{shoes.manufacturer}</Col>
                </Row>

                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Type:</Col>
                    <Col xs={6} className="ps-4">{shoes.categoryName}</Col>
                </Row>

                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Price (đ):</Col>
                    <Col xs={6} className="ps-4">{shoes.price}</Col>
                </Row>

                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Production date:</Col>
                    <Col xs={6} className="ps-4">{formatDate(shoes.productionDate)}</Col>
                </Row>

                <Row className="mb-2 fs-4">
                    <Col xs={6} className="text-end">Import Date:</Col>
                    <Col xs={6} className="ps-4">{formatDate(shoes.importDate)}</Col>
                </Row>

                <div className="d-flex justify-content-center mt-5">
                    <Button
                        variant="light"
                        onClick={() => navigate('/')}
                        style={{
                            border: '2px solid #5a82a6',
                            color: '#000',
                            padding: '10px 40px',
                            backgroundColor: '#e9e9e9',
                            fontWeight: 'bold'
                        }}
                    >
                        Quay Lai
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default PageDetail;