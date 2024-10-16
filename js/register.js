document.querySelector('#btn-register').addEventListener('click', async () => {
    const form = document.querySelector('.register-form')
    const data = serialize(form, { hash: true, empty: true })
    if (data.username === '') {
        return showToast('用户名不能为空')
    }
    if (data.password === '') {
        return showToast("密码不能为空")
    }
    if (data.username.length < 6) {
        return showToast('用户名长度太短')
    }
    if (data.password.length < 8) {
        return showToast('密码长度太短')
    }
    const res = await axios.post('/register', data)
    showToast(res.data.message)
    setTimeout(() => { location.href = './login.html' }, 1000)

})