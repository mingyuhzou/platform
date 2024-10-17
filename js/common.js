axios.defaults.baseURL = 'https://hmajax.itheima.net'

// 弹出提示框
function showToast(msg) {
    const toast = new bootstrap.Toast(document.querySelector('.my-toast'))
    toast.show()
    document.querySelector('.toast-body').innerHTML = msg
}

// 检查token是否存在
const checkToken = () => {
    const { token } = JSON.parse(localStorage.getItem('usermsg'))
    // console.log(token);
    if (!token) {
        showToast('请先登录')
        setTimeout(() => { location.href = './login.html' }, 1500)
    }
}

const renderUsername = () => {
    const { username } = JSON.parse(localStorage.getItem('usermsg'))
    if (username) {
        document.querySelector('.username').innerHTML = username
    }
}

const logout = () => {
    document.querySelector('#logout').addEventListener('click', () => {
        localStorage.removeItem('usermsg')
        showToast('退出成功')
        setTimeout(() => {
            location.href = './login.html'
        }, 1500)
    })
}

// 添加请求拦截器 config是请求的参数
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('usermsg') ? JSON.parse(localStorage.getItem('usermsg')).token : ''
    if (token) {
        config.headers['Authorization'] = JSON.parse(localStorage.getItem('usermsg')).token
        console.log(config);
    }
    return config
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});
