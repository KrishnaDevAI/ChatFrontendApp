import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text = '') =>
    Swal.fire({
        icon: 'success',
        title,
        text,
        timer: 1500,
        showConfirmButton: false
    });

export const showErrorAlert = (title, text = '') =>
    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'OK'
    });

export const showLoginSuccess = (user) =>
    showSuccessAlert('Login successful', `Welcome ${user?.first_name || user?.email || 'User'}!`);