import {toast} from 'react-toastify';

export const errorMessage = (data) => {
    toast.error(data);
}

export const successMessage = (data) => {
    toast.success(data);
}