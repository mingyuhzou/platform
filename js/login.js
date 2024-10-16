console.log(1);
const form = document.querySelector('.login-form')
document.querySelector('#btn-login').addEventListener('click', async () => {
    const data = serialize(form, { hash: true, empty: true })
    console.log(1);

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
    try {
        const res = await axios.post('/login', data)
        const obj = { username: res.data.data.username }
        localStorage.setItem('usermsg', JSON.stringify(obj))
        showToast(res.data.message)
        setTimeout(() => { location.href = './index.html' }, 1000)
    }
    catch (err) {
        showToast(err);
    }


})