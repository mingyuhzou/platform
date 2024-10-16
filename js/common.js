axios.defaults.baseURL = 'https://hmajax.itheima.net'

function showToast(msg) {
    const toast = new bootstrap.Toast(document.querySelector('.my-toast'))
    toast.show()
    document.querySelector('.toast-body').innerHTML = msg
}