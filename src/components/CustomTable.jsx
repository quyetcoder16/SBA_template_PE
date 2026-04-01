import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomTable = ({ data, startIndex, onDelete }) => (
    <Table bordered hover responsive>
        <thead >
            <tr style={{ backgroundColor: '#ddebf7', color: 'black' }}>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>#</th>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>Shoes Name</th>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>Category</th>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>Manufacturer</th>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>Price (đ)</th>
                <th style={{ backgroundColor: 'inherit', color: 'inherit' }}>Action</th>
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
                        <Button variant="link" className="p-0 text-danger" onClick={() => onDelete(item)}>Delete</Button>
                        {' | '}
                        <Link to={`/view/${item.shoesId}`}>View</Link>
                        {' | '}
                        <Link to={`/update/${item.shoesId}`}>Update</Link>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default CustomTable;