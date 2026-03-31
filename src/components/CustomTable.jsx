import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomTable = ({ data, startIndex, onDelete }) => (
    <Table bordered hover responsive>
        <thead>
            <tr>
                <th>#</th>
                <th>Shoes Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Price (đ)</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
                <tr key={item.shoesId}>
                    <td>{startIndex + index + 1}</td>
                    <td>{item.shoesName}</td>
                    <td>{item.categoryName}</td>
                    <td>{item.manufacturer}</td>
                    <td>{new Intl.NumberFormat('vi-VN').format(item.price)}</td>
                    <td>
                        <Button variant="link" className="p-0" onClick={() => onDelete(item)}>Delete</Button>
                        {' | '}
                        <Link to={`/view/${item.shoesId}`}>View</Link>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default CustomTable;