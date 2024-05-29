import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, DatePicker, InputNumber, Typography, Layout, Card } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import "./ShipmentDetail.css";
const { Title } = Typography;
const { Header, Content, Sider } = Layout;


function ShipmentDetail() {

    const { id } = useParams();
    const [shipment, setShipment] = useState({});
    const [formDisabled, setFormDisabled] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setShipment({});
            //const response = await MyAPI.getData(someId);
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

    return (
        <Form>
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
                width='50vw'>

                {formDisabled ? (
                    <Button type="primary" onClick={() => setFormDisabled(false)} style={{marginBottom: 16}}>
                        Edit
                    </Button>
                ) : (
                    <Form.Item>
                        <Button type="primary" onClick={() => setFormDisabled(true)} htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                )}
    
                    <Form.Item label="Carrier">
                        <Input value={shipment.carrier} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Tracking code">
                        <Input value={shipment.trackingCode} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Carrier tracking URL">
                        <Input value={shipment.carrierTrackingUrl} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Status">
                        <Input value={shipment.status} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Weight">
                        <InputNumber value={shipment.weight} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Estimated delivery date">
                        <DatePicker
                                    defaultValue={dayjs(shipment.estimatedDeliveryDate)}
                                    format="YYYY/MM/DD"
                                    disabled={formDisabled}
                                    className="disabled-input"
                        />
                    </Form.Item>

                    <Title level={4}>Address from</Title>
                    <Form.Item label="Street number">
                        <Input value={shipment.addressFrom?.streetNr} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Street name">
                        <Input value={shipment.addressFrom?.streetName} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="City">
                        <Input value={shipment.addressFrom?.city} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Country">
                        <Input value={shipment.addressFrom?.country} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Postal code">
                        <Input value={shipment.addressFrom?.postcode} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>

                    <Title level={4}>Address to</Title>
                    <Form.Item label="Street number">
                        <Input value={shipment.addressTo?.streetNr} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Street name">
                        <Input value={shipment.addressTo?.streetName} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="City">
                        <Input value={shipment.addressTo?.city} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Country">
                        <Input value={shipment.addressTo?.country} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Postal code">
                        <Input value={shipment.addressTo?.postcode} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Title level={4}>Customer</Title>
                    <Form.Item label="Customer name">
                        <Input value={shipment.relatedCustomer?.name} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
                    <Form.Item label="Customer link">
                        <Input value={shipment.relatedCustomer?.href} disabled={formDisabled} className="disabled-input"/>
                    </Form.Item>
            </Sider>
            <Layout
            style={{
                marginLeft: '50vw',
                }}
                width='70vw'>
            <Content>
            <Title level={4}>Orders</Title>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '30px',
                }}>
                {shipment.order?.map(order => (
                    <Card key={order.id}>
                        <Form.Item label="Order link">
                            <Input value={order.href} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                        <Form.Item label="Order name">
                            <Input value={order.name} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                        <Form.Item label="Referred type">
                            <Input value={order.referredType} disabled={formDisabled} className="disabled-input"/>
                        </Form.Item>
                    </Card>
                ))}
                </div>
            </Content>
            </Layout>
            
        </Layout>
        </Form>
    );
}

export default ShipmentDetail;