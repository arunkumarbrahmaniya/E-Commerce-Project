import React from 'react';
import {Card} from 'antd';
import productDefault from '../../images/default.png';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const {Meta} = Card;
const AdminProductCard = ({product, handleRemove}) => {
    const {title,description, images, slug} = product;
    return (
        <Card 
            cover={
                <img
                    src={images && images.length ? images[0].url : productDefault}
                    style={{height:150, objectFit:"cover"}}
                    className="p-1"
                />
            }
            actions={[
                <EditOutlined className="text-warning"/>,
                <DeleteOutlined
                    className="text-danger"
                    onClick={() => handleRemove(slug)}
                />
            ]}
            className="mb-2"
        >
            <Meta
                title={title}
                description={`${description && description.substring(0, 30)}...`}
            />
        </Card>
    )
}

export default AdminProductCard;