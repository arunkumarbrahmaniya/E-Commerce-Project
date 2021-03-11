import React, {useState} from 'react';
import { Card, Tooltip } from 'antd';
import {
    EyeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import productDefault from '../../images/default.png';
import { Link } from 'react-router-dom';
import showAverage from '../../functions/rating';
import _ from 'lodash';
const {Meta} = Card;

const ProductCard = ({product}) => {
    const {title, description,images, slug, price} = product;
    const [tooltip, setTooltip] = useState('Click to add');
    const handleAddCart = () => {
        let cart = [];
        if(typeof window !== 'undefined') {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            cart.push({...product,
            count: 1
        });
        let unique = _.uniqWith(cart,_.isEqual);
        localStorage.setItem('cart', JSON.stringify(unique));
        setTooltip('Added');
        }
    }

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
            <Tooltip title={tooltip}>
                <a onClick={handleAddCart}>
                <ShoppingCartOutlined
                    className="text-danger" 
                /> <br/> Add to Cart
                </a>
            </Tooltip>
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