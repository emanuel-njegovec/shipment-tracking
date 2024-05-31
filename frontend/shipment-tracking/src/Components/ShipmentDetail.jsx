import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, DatePicker, InputNumber, Typography, Layout, Card, Select, message, Divider } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import "./ShipmentDetail.css";
const { Title } = Typography;
const { Content, Sider } = Layout;
const { Option } = Select;


function ShipmentDetail() {

    const { id } = useParams();
    const [shipment, setShipment] = useState({});
    const [formDisabled, setFormDisabled] = useState(true);

    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Shipment updated successfully',
        });
    }

    useEffect(() => {
        async function fetchData() {
            setShipment({});
            if (!id) {
                setFormDisabled(false);
                return;
            }
            const res = await axios.get(`http://localhost:8080/shipmentTracking/v1/shipmentTracking/${id}`);
            console.log(res.data);

            if (!ignore) {
                setShipment(res.data);
            }
        }
        let ignore = false;
        fetchData();
        return () => { ignore = true; }
    }, [id]);

    const saveData = async () => {
        if (!id) {
            try {
                console.log(shipment);
                const res = await axios.post('http://localhost:8080/shipmentTracking/v1/shipmentTracking', shipment);
                console.log(res.data);
                setFormDisabled(true);
                success();
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                console.log(shipment);
                const res = await axios.patch(`http://localhost:8080/shipmentTracking/v1/shipmentTracking/${id}`, shipment);
                console.log(res.data);
                setFormDisabled(true);
                success();
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShipment(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (name, value) => {
        setShipment(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleAddressFromChange = (e) => {
        const { name, value } = e.target;
        setShipment(prevState => ({
            ...prevState,
            addressFrom: {
                ...prevState.addressFrom,
                [name]: value,
            }
        }));
    };

    const handleAddressToChange = (e) => {
        const { name, value } = e.target;
        setShipment(prevState => ({
            ...prevState,
            addressTo: {
                ...prevState.addressTo,
                [name]: value,
            }
        }));
    };

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setShipment(prevState => ({
            ...prevState,
            relatedCustomer: {
                ...prevState.relatedCustomer,
                [name]: value,
            }
        }));
    };

    const handleOrderChange = (index, e) => {
        const { name, value } = e.target;
        setShipment(prevState => {
            const newOrder = [...prevState.order];
            newOrder[index] = {
                ...newOrder[index],
                [name]: value,
            };
            return {
                ...prevState,
                order: newOrder,
            };
        });
        console.log(shipment.order);
    }

    const handleNewOrder = () => {
        setShipment(prevState => ({
            ...prevState,
            order: [
                ...(Array.isArray(prevState.order) ? prevState.order : []),
                {
                    href: '',
                    name: '',
                    referredType: '',
                }
            ]
        }));
    }

    return (
        <Form>
        {contextHolder}
        <Layout hasSider
            style={{
                paddingLeft: '100px',
                paddingRight: '100px',
            }}
        >
            <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'white',
                paddingLeft: '100px',
                paddingRight: '100px',
                paddingTop: '20px',
                }}
                width='50vw'
                >
                    {formDisabled ? (
                        <Button type="primary" onClick={() => setFormDisabled(false)} style={{marginBottom: 16}}>
                            Edit
                        </Button>
                    ) : (
                        <Form.Item>
                            <Button type="primary" onClick={saveData} htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    )}

                    <Form.Item label="Carrier">
                        <Input name="carrier" value={shipment.carrier} onChange={handleInputChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Tracking code">
                        <Input name="trackingCode" value={shipment.trackingCode} onChange={handleInputChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Carrier tracking URL">
                        <Input name="carrierTrackingUrl" value={shipment.carrierTrackingUrl} onChange={handleInputChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Status">
                        <Select name="status" value={shipment.status} onChange={(value) => handleSelectChange('status', value)} disabled={formDisabled} required className="disabled-input">
                            <Option value="initialized">Initialized</Option>
                            <Option value="inProcess">In process</Option>
                            <Option value="processed">Processed</Option>
                            <Option value="shipped">Shipped</Option>
                            <Option value="delivered">Delivered</Option>
                            <Option value="returned">Returned</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Weight">
                        <InputNumber name="weight" value={shipment.weight} onChange={(v, e) => setShipment({...shipment, ["weight"]: v})} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Estimated delivery date">
                        <DatePicker
                                    name="estimatedDeliveryDate"
                                    defaultValue={dayjs(shipment.estimatedDeliveryDate)}
                                    format="YYYY/MM/DD"
                                    disabled={formDisabled}
                                    className="disabled-input"
                                    required
                        />
                    </Form.Item>

                    <Title level={4}>Address from</Title>
                    <Form.Item label="Street number">
                        <Input name="streetNr" value={shipment.addressFrom?.streetNr} onChange={handleAddressFromChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Street name">
                        <Input name="streetName" value={shipment.addressFrom?.streetName} onChange={handleAddressFromChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="City">
                        <Input name="city" value={shipment.addressFrom?.city} onChange={handleAddressFromChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Country">
                        <Input name="country" value={shipment.addressFrom?.country} onChange={handleAddressFromChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Postal code">
                        <Input name="postcode" value={shipment.addressFrom?.postcode} onChange={handleAddressFromChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>

                    <Title level={4}>Address to</Title>
                    <Form.Item label="Street number">
                        <Input name="streetNr" value={shipment.addressTo?.streetNr} onChange={handleAddressToChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Street name">
                        <Input name="streetName" value={shipment.addressTo?.streetName} onChange={handleAddressToChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="City">
                        <Input name="city" value={shipment.addressTo?.city} onChange={handleAddressToChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Country">
                        <Input name="country" value={shipment.addressTo?.country} onChange={handleAddressToChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Postal code">
                        <Input name="postcode" value={shipment.addressTo?.postcode} onChange={handleAddressToChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Title level={4}>Customer</Title>
                    <Form.Item label="Customer name">
                        <Input name="name" value={shipment.relatedCustomer?.name} onChange={handleCustomerChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Customer link">
                        <Input name="href" value={shipment.relatedCustomer?.href} onChange={handleCustomerChange} disabled={formDisabled} required className="disabled-input"/>
                    </Form.Item>
            </Sider>
            <Layout
            style={{
                marginLeft: '50vw',
                }}
                width='70vw'>
            <Content
            style={{
                height: '100vh',
            }}
            >
            <Title level={4}>Orders</Title>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                }}>
                {shipment.order?.map((order, index) => (
                    <Card key={index}>
                        <Form.Item label="Order link">
                            <Input name="href" value={order.href} onChange={(e) => handleOrderChange(index, e)} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                        <Form.Item label="Order name">
                            <Input name="name" value={order.name} onChange={(e) => handleOrderChange(index, e)} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                        <Form.Item label="Referred type">
                            <Input name="referredType" value={order.referredType} onChange={(e) => handleOrderChange(index, e)} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                    </Card>
                ))}
                </div>
                <Button type="primary" onClick={handleNewOrder} style={{marginTop: 16}}>
                    Add order
                </Button>
            </Content>
            </Layout>
            
        </Layout>
        </Form>
    );
}

export default ShipmentDetail;