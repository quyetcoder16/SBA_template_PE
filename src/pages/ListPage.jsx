import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deleteShoes, getCategories, getShoes } from '../service/api';
import CustomFilter from '../components/CustomFilter';
import CustomTable from '../components/CustomTable';
import { Col, Pagination, Row } from 'react-bootstrap';
import DeleteModal from '../components/DeleteModal';

export default function ListPage() {
    const navigate = useNavigate();

    // Data State
    const [shoes, setShoes] = useState([]);
    const [categories, setCategories] = useState([]);
    // 1. State lưu giá trị đang nhập trên Form (chưa search)
    const [filters, setFilters] = useState({ name: '', category: '' });

    // 2. State lưu giá trị thực tế đang dùng để truy vấn (đã nhấn Search)
    const [searchParams, setSearchParams] = useState({ name: '', category: '' });

    // State phân trang 
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 5
    });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Fetch Categories (chỉ chạy 1 lần)
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCats();
    }, []);

    const fetchShoesData = useCallback(async () => {
        try {
            const res = await getShoes(
                searchParams.name,      // Dùng searchParams
                searchParams.category,  // Dùng searchParams
                pageInfo.currentPage,
                pageInfo.pageSize
            );
            setShoes(res.data.content);
            setPageInfo(prev => ({
                ...prev,
                totalPages: res.data.totalPages,
                totalElements: res.data.totalElements
            }));
        } catch (error) {
            console.error("Error in fetch:", error);
            setShoes([]);
        }
    }, [searchParams, pageInfo.currentPage, pageInfo.pageSize]);

    useEffect(() => {
        fetchShoesData();
    }, [fetchShoesData]);

    // Thay đổi giá trị trên input (chưa gọi API)
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        // Cập nhật searchParams để kích hoạt useEffect fetch data
        setSearchParams({ ...filters });
        // Bắt buộc quay về trang đầu tiên (0)
        setPageInfo(prev => ({ ...prev, currentPage: 0 }));
    };

    const confirmDelete = async () => {
        try {
            await deleteShoes(deleteTarget.shoesId);
            setAlert({ show: true, message: 'Delete successful!', type: 'success' });
            setDeleteTarget(null);

            // Nếu xóa hết item ở trang cuối thì lùi về 1 trang
            if (shoes.length === 1 && pageInfo.currentPage > 0) {
                setPageInfo(p => ({ ...p, currentPage: p.currentPage - 1 }));
            } else {
                fetchShoesData();
            }
        } catch (err) {
            setAlert({ show: true, message: 'An error occurred while deleting!', type: 'danger' });
        } finally {
            setTimeout(() => setAlert({ ...alert, show: false }), 2000);
        }
    };



    return (
        <div className='container'>
            <h3>Shoes List</h3>
            <CustomFilter
                categories={categories}
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onAdd={() => navigate('/add')}
            />
            <h3>Shoes List</h3>

            {shoes.length > 0 ? (<>
                <CustomTable
                    data={shoes}
                    startIndex={pageInfo.currentPage * pageInfo.pageSize}
                    onDelete={setDeleteTarget}
                />
                <Row>
                    <Col md={8}>
                        <p className="text-muted">
                            Show {shoes.length} of {pageInfo.totalElements} records
                        </p>
                    </Col>
                    <Col md={4} className="text-muted">
                        <Pagination shadow-sm>
                            <Pagination.First
                                disabled={pageInfo.currentPage === 0}
                                onClick={() => setPageInfo(p => ({ ...p, currentPage: 0 }))}
                            />
                            <Pagination.Prev
                                disabled={pageInfo.currentPage === 0}
                                onClick={() => setPageInfo(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                            />

                            {[...Array(pageInfo.totalPages).keys()].map(n => (
                                <Pagination.Item
                                    key={n}
                                    active={n === pageInfo.currentPage}
                                    onClick={() => setPageInfo(p => ({ ...p, currentPage: n }))}
                                >
                                    {n + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next
                                disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
                                onClick={() => setPageInfo(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                            />
                            <Pagination.Last
                                disabled={pageInfo.currentPage >= pageInfo.totalPages - 1}
                                onClick={() => setPageInfo(p => ({ ...p, currentPage: pageInfo.totalPages - 1 }))}
                            />
                        </Pagination>
                    </Col>
                </Row>
            </>) : (
                <div className="text-center py-5 border rounded bg-light mt-3">
                    <h5 className="text-muted">No records found!</h5>
                </div>
            )}


            {/* // Modal xác nhận xóa */}
            <DeleteModal
                show={!!deleteTarget}
                target={deleteTarget}
                onHide={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />

        </div>
    )
}
