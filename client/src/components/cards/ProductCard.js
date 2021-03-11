import React from 'react';
import { Card } from 'antd';
import {
    EyeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import productDefault from '../../images/default.png';
import { Link } from 'react-router-dom';
import showAverage from '../../functions/rating';

const {Meta} = Card;

const ProductCard = ({product}) => {
    const {title, description,images, slug, price} = product;

    return (
        <>
        {
                product && product.rating && product.rating.length > 0 ?
                showAverage(product) : 
                <div className="text-center pt-1 pb-3">
                    No ratings yet
                </div>
            }
        <Card
        cover={
            <img
                src={images && images.length ? images[0].url : productDefault}
                style={{height:150, objectFit:"cover"}}
                className="p-1"
                alt="shopping"
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
                title={`${title} - $${price}`}
                description={`${description && description.substring(0, 30)}...`}
            />
        </Card>
        </>
    )
}

export default ProductCard;