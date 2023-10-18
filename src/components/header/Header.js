import React from 'react'
import { logoutUser } from '../../services/authService'
import { SET_LOGIN, selectName } from '../../redux/features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logout = async () => {
        await logoutUser()
        await dispatch(SET_LOGIN(false))
        navigate("/")
        toast.success("Logout successful")
    }
    const name = useSelector(selectName)


    return (
        <div className='--pad header'>
            <div className="--flex-between">
                <h3>
                    <span className='--fw-thin'>Welcome, </span>
                    <span className='--color-danger'>{name} </span>
                </h3>
                <button className='--btn --btn-danger' onClick={logout}>Logout</button>
            </div>
            <hr />
        </div>
    )
}

export default Header