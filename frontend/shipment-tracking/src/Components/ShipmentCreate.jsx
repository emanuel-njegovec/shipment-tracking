import React from "react";
import { Form, Input, Button } from "antd";

function ShipmentCreate() {
    return (
        <div>
            <h1>Shipment Create</h1>
            <Form
                style={{width: 400}}
            >
                <Form.Item
                    label="Carrier"
                    name="carrier"
                    rules={[{ required: true, message: 'Please input the carrier!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please input the status!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ShipmentCreate;