import React, { useEffect } from 'react'
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import "./ProductSummary.scss"
import InfoBox from '../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import { CALCULATE_CATEGORY, CALCULATE_OUTOFSTOCK, CALCULATE_STORE_VALUE, selectCategory, selectOutOfStock, selectTotalStoreValue } from '../../../redux/features/product/productSlice';


// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />;
const productIcon = <BsCart4 size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;

// Format Amount
export const formatNumbers = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({ products }) => {
    const dispatch = useDispatch()
    const totalStoreValue = useSelector(selectTotalStoreValue)
    const OutOfStock = useSelector(selectOutOfStock)
    const category = useSelector(selectCategory)

    useEffect(() => {
        dispatch(CALCULATE_STORE_VALUE(products))
        dispatch(CALCULATE_OUTOFSTOCK(products))
        dispatch(CALCULATE_CATEGORY(products))
    }, [dispatch, products])
    return (
        <div className='product-summary'>
            <h3 className='--mt'>Inventory Stats</h3>
            <div className="info-summary">
                <InfoBox icon={productIcon} title={"Total Products"} count={products.length} bgColor="card1" />
                <InfoBox icon={earningIcon} title={"Total Store Value"} count={`$${formatNumbers(totalStoreValue.toFixed(2))}`} bgColor="card2" />
                <InfoBox icon={outOfStockIcon} title={"Out of Stock"} count={OutOfStock} bgColor="card3" />
                <InfoBox icon={categoryIcon} title={"All Categories"} count={category.length} bgColor="card4" />
            </div>
        </div>
    )
}

export default ProductSummary