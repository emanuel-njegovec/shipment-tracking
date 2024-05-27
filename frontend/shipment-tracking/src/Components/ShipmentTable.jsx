import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Table } from "antd";


function ShipmentTable() {

    const [shipments, setShipments] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5
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
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" style={{marginRight: 16}}>
                        <Link to={`/shipmentTracking/${record.id}`}>View</Link>
                    </Button>
                    <Button type="primary" >
                        <Link to={`/shipmentTracking/${record.id}/edit`}>Edit</Link>
                    </Button>
                </span>
            ),
        },
    ]
    
    useEffect(() => {
        async function fetchData() {
            setShipments([]);
            //const response = await MyAPI.getData(someId);
            const res = await axios.get('http://localhost:8080/shipmentTracking/v1/shipmentTracking', 
                                    tableParams.pagination);
            if (!ignore) {
                setShipments(res.data);
            }
        }
        let ignore = false;
        fetchData();
        return () => { ignore = true; }
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange = (pagination) => {
        setTableParams({
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize
            }
        });
    }
    
    return (
        <div>
            <h1>Shipment List</h1>
            <Link to="/shipment/create">Create New Shipment</Link>
            <Table
                dataSource={shipments} 
                rowKey="id"
                columns={columns} 
                pagination={tableParams.pagination}
                onChange={handleTableChange}/>
        </div>
    );
}

export default ShipmentTable;