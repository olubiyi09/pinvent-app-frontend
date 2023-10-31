import React, { useEffect, useState } from 'react';
import "./ProductDetail.scss";
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSlice';
import { getAProduct } from '../../../redux/features/product/productSlice';
import Card from '../../card/Card';
import { SpinnerImg } from '../../loader/Loader';
import DOMPurify from "dompurify";

const ProductDetail = () => {
    useRedirectLoggedOutUser("/login");
    const dispatch = useDispatch();

    const { id } = useParams();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [sanitizedDescription, setSanitizedDescription] = useState('');

    useEffect(() => {
        if (isLoggedIn === true) {
            dispatch(getAProduct(id));
        }
    }, [isLoggedIn, dispatch, id]);

    const stockStatus = (quantity) => {
        if (quantity > 0) {
            return <span className='--color-success'>In Stock</span>;
        }
        return <span className='--color-danger'>Out Stock</span>;
    };

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
    }, [isError, message]);

    useEffect(() => {
        if (product) {
            // Sanitize the product description before setting it in the state
            const sanitizedDescription = DOMPurify.sanitize(product.description);
            setSanitizedDescription(sanitizedDescription);
        }
    }, [product]);

    const { product, isLoading, isError, message } = useSelector((state) => state.product);

    return (
        <div className="product-detail">
            <h3>Product Details</h3>
            <Card cardClass="card">
                {isLoading && <SpinnerImg />}
                {product && (
                    <div className='detail'>
                        <Card cardClass="group">
                            {product.image ? (
                                <img src={product.image.filePath} alt={product.image.fileName} />
                            ) : (
                                <p>No image set for this product</p>
                            )}
                        </Card>
                        <h4>Product Availability: {stockStatus(product.quantity)}</h4>
                        <hr />
                        <h4>
                            <span className="badge">Name: </span> &nbsp; {product.name}
                        </h4>

                        <p>
                            <b>&rarr; SKU : </b> {product.sku}
                        </p>

                        <p>
                            <b>&rarr; Category : </b> {product.category}
                        </p>

                        <p>
                            <b>&rarr; Price : </b> {"$"} {product.price}
                        </p>

                        <p>
                            <b>&rarr; Quantity in Stock : </b> {product.quantity}
                        </p>

                        <p>
                            <b>&rarr; Total Value in Stock : </b> {"$"} {product.price * product.quantity}
                        </p>
                        <hr />
                        <div dangerouslySetInnerHTML={{
                            __html: sanitizedDescription
                        }}>
                        </div>
                        <hr />
                        <code className='--color-dark'>Created on: {product.createdAt.toLocaleString("en-US")}</code>
                        <br />
                        <code className='--color-dark'>Last Updated: {product.updatedAt.toLocaleString("en-US")}</code>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProductDetail;
