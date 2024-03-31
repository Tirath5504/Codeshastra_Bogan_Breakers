import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const CheckAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {

        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
    }, [navigate]);
    return (
        <div>

        </div>
    )
}

export default CheckAuth
