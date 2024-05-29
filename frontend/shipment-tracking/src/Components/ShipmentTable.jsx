import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Table, Input, Select, Card } from "antd";
import "./ShipmentTable.css";
const { Option } = Select;


function ShipmentTable() {

    const [shipments, setShipments] = useState([]);
    const [customerSearch, setCustomerSearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [status, setStatus] = useState(null);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
        }
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Carrier',
            dataIndex: 'carrier',
            key: 'carrier',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Order ID',
            dataIndex: 'order',
            key: 'order',
            render: (order) => order.map(o => o.id).join(', '),
        },
        {
            title: 'Customer',
            dataIndex: 'relatedCustomer',
            key: 'relatedCustomer',
            render: (customer) => customer.name,
        },
        {
            title: '',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{marginRight: 16}}>
                        <Link to={`/shipmentTracking/${record.id}`}>Open</Link>
                    </Button>
                </span>
            ),
        },
    ]
    
    useEffect(() => {
        async function fetchData() {
            setShipments([]);
            const params = {
                ...tableParams.pagination,
                customerId: customerSearch,
                orderId: orderSearch,
                status: status,
            }
            //const response = await MyAPI.getData(someId);
            const res = await axios.get('http://localhost:8080/shipmentTracking/v1/shipmentTracking', 
                                    { params: params });
            if (!ignore) {
                setShipments(res.data);
            }
        }
        let ignore = false;
        fetchData();
        return () => { ignore = true; }
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize, customerSearch, orderSearch, status]);

    const handleTableChange = (pagination) => {
        setTableParams({
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize,
            }
        });
    }

    const handleSearch = (e) => {
        if (e.target.placeholder === 'Search by customer ID') {
            setCustomerSearch(e.target.value);
        }
        if (e.target.placeholder === 'Search by order ID') {
            setOrderSearch(e.target.value);
        }
    }

    const handleStatusChange = (value) => {
        setStatus(value);
    }
    
    return (
        <div>
            <h1>Shipment List</h1>
            <div className="search-components">
                <Card
                    title="Customer ID"
                >
                    <Input 
                        placeholder="Search by customer ID"
                        onChange={handleSearch}
                        allowClear
                    />
                </Card>
                
                <Card
                    title="Order ID"
                >
                    <Input 
                        placeholder="Search by order ID"
                        onChange={handleSearch}
                        allowClear
                    />
                </Card>
                
                <Card
                    title="Status"
                >
                    <Select
                        placeholder="Filter by status"
                        onChange={handleStatusChange}
                        allowClear
                    >
                        <Option value="initialized">Initialized</Option>
                        <Option value="inProcess">In process</Option>
                        <Option value="processed">Processed</Option>
                        <Option value="shipped">Shipped</Option>
                        <Option value="delivered">Delivered</Option>
                        <Option value="returned">Returned</Option>
                    </Select>
                </Card>
            </div>
            
            <Table
                dataSource={shipments} 
                rowKey="id"
                columns={columns} 
                pagination={{...tableParams.pagination, position: ['bottomCenter']}}
                onChange={handleTableChange}/>
            <Button type="primary" style={{marginBottom: 16}}>
                <Link to="/shipmentTracking/new">Create New Shipment</Link>
            </Button>
        </div>
    );
}

export default ShipmentTable;