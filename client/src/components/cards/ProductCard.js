import React from 'react';
import { Card } from 'antd';
import {
    EyeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import productDefault from '../../images/default.png';
import { Link } from 'react-router-dom';
import LoadingCard from '../../components/cards/LoadingCard';

const {Meta} = Card;

const ProductCard = ({product}) => {
    const {title, description,images, slug} = product;

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
            <Link to={`/product/${slug}`}>
                <EyeOutlined className="text-warning"/>
                <br/>
                View Product
            </Link>,
            <>
            <ShoppingCartOutlined
                className="text-danger" 
            /> <br/> Add to Cart
            </>
        ]}
        >
            <Meta
                title={title}
                description={`${description && description.substring(0, 30)}...`}
            />
        </Card>
    )
}

export default ProductCard;