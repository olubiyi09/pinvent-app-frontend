import React, { useEffect, useState } from 'react'
import "./ProductList.scss"
import { SpinnerImg } from '../../loader/Loader'
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Search from '../../search/Search';
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from 'react-redux';
import { FILTER_PRODUCTS, selectFilteredProduct } from '../../../redux/features/product/filterSlice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteProduct, getProduct } from '../../../redux/features/product/productSlice';


const ProductList = ({ products, isLoading }) => {
    const dispatch = useDispatch()
    const filteredProduct = useSelector(selectFilteredProduct)
    const [search, setSearch] = useState("")

    const shortenText = (text, n) => {
        if (text.length > n) {
            const shortenedText = text.substring(0, n).concat("...");
            return shortenedText;
        }
        return text;
    };

    const delProduct = async (id) => {
        await dispatch(deleteProduct(id))
        await dispatch(getProduct())
    }

    // Modal to confirm delete
    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product.',
            buttons: [
                {
                    label: 'Delete',
                    onClick: () => delProduct(id)
                },
                {
                    label: 'Cancel',
                    // onClick: () => alert('Click No')
                }
            ]
        });
    }
    // Modal to confirm delete ends here

    //   Begin Pagination
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(filteredProduct.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filteredProduct.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, filteredProduct]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredProduct.length;
        setItemOffset(newOffset);
    };
    //   End Pagination

    useEffect(() => {
        dispatch(FILTER_PRODUCTS({ products, search }))
    }, [products, search, dispatch])

    return (
        <div className='product-list'>
            <hr />
            <div className="table">
                <div className="--flex-between --flex-dir-column">
                    <span>
                        <h3>Inventory Items</h3>
                    </span>

                    <span>
                        <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                    </span>
                </div>

                {isLoading && <SpinnerImg />}

                <div className="table">
                    {!isLoading && products.length === 0 ? (
                        <p>No product found please add a product</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>s/n</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>



                            <tbody>
                                {
                                    currentItems.map((product, index) => {
                                        const { _id, name, category, price, quantity } = product
                                        return (
                                            <tr key={_id}>
                                                <td>{index + 1}</td>
                                                <td>{shortenText(name, 16)}</td>
                                                <td>{category}</td>
                                                <td>{"$"}{price}</td>
                                                <td>{quantity}</td>
                                                <td>{"$"}{price * quantity}</td>

                                                <td className="icons">
                                                    <span>
                                                        <Link to={`/product-detail/${_id}`}>
                                                            <AiOutlineEye size={25} color={"purple"} />
                                                        </Link>
                                                    </span>
                                                    <span>
                                                        <Link to={`/edit-product/${_id}`}>
                                                            <FaEdit size={20} color={"green"} />
                                                        </Link>
                                                    </span>
                                                    <span>
                                                        <FaTrashAlt
                                                            size={20}
                                                            color={"red"}
                                                            onClick={() => confirmDelete(_id)}
                                                        />
                                                    </span>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    )}
                </div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={6}
                    pageCount={pageCount}
                    previousLabel="Prev"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="activePage"
                />
            </div>
        </div>
    )
}

export default ProductList