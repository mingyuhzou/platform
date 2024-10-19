checkToken()
renderUsername()
logout()
const render = async () => {
    const { data } = await axios.get('/students')
    const str = data.map(item => {
        return `                    
                    <tr data-id=${item.user_id}>
                      <td>${item.name}</td>
                      <td>${item.age}</td>
                      <td>${!item.gender ? '男' : '女'}</td>
                      <td>第${item.group}组</td>
                      <td>${item.hope_salary}</td>
                      <td>${item.salary}</td>
                      <td>${item.province + item.city + item.area}</td>
                      <td>
                        <a href="javascript:;" class="text-success mr-3" data-id=${item.id}><i class="bi bi-pen"></i></a>
                        <a href="javascript:;" class="text-danger" data-id=${item.id}><i class="bi bi-trash"></i></a>
                      </td>
                    </tr>`
    }).join(" ")
    document.querySelector('.list').innerHTML = str


}
render()
const modal = new bootstrap.Modal(document.querySelector('#modal'))
document.querySelector('#openModal').addEventListener('click', () => {
    modal.show()
    document.querySelector('.modal-title').innerHTML = '添加学员'
})

const province = document.querySelector('[name="province"]')
const city = document.querySelector('[name="city"]')
const area = document.querySelector('[name="area"]')

const selectInit = async () => {
    const { list: res } = await axios.get('/api/province')

    province.innerHTML += res.map(item => {
        return `<option value="${item}">${item}</option>`
    }).join(" ")


    province.addEventListener('change', async e => {
        city.innerHTML = '<option value="">--城市--</option>'
        area.innerHTML = '<option value="">--地区--</option>'
        const pname = e.target.value
        const { list } = await axios.get('/api/city', { params: { pname } })
        city.innerHTML += list.map(item => {
            return `<option value="${item}">${item}</option>`
        })
    })

    city.addEventListener('change', async e => {
        area.innerHTML = '<option value="">--地区--</option>'

        const cname = e.target.value
        const pname = province.value

        const { list } = await axios.get('/api/area', { params: { pname, cname } })
        area.innerHTML += list.map(item => {
            return `<option value="${item}">${item}</option>`
        })

    })


}
const form = document.querySelector('#form')
selectInit()

document.querySelector('#submit').addEventListener('click', () => {
    if (document.querySelector('.modal-title').innerHTML === '编辑学员') {
        editSubmit()
    }
    else addStudent()
})
const addStudent = async () => {
    const data = serialize(form, { hash: true, empty: true })
    data.age = +data.age
    data.gender = +data.gender
    data.group = +data.group
    data.hope_salary = +data.hope_salary
    data.salary = +data.salary
    try {
        const msg = await axios.post('/students', data)
        showToast(msg.message)
        modal.hide()
        form.reset()
        render()
    }
    catch (err) {
        modal.hide()
        showToast('输入有误')
    }
}

document.querySelector('.list').addEventListener('click', e => {
    if (e.target.classList.contains('bi-trash')) {
        delStudent(e.target.parentNode.dataset.id)
    }
    else if (e.target.classList.contains('bi-pen')) {
        modal.show()
        document.querySelector('.modal-title').innerHTML = '编辑学员'
        editStudent(e.target.parentNode.dataset.id)
        document.querySelector('.modal-title').dataset.id = e.target.parentNode.dataset.id
    }
})
const delStudent = async (id) => {
    try {
        const res = await axios.delete(`/students/${id}`)
        showToast('请求成功')
        render()
    } catch (err) {
        console.log(err);
    }
}

const editStudent = async (id) => {

    const { data } = await axios.get(`/students/${id}`)
    console.log(data);

    const arr = ["age", 'name', 'salary', 'hope_salary', 'group']
    arr.forEach(item => {
        document.querySelector(`[name=${item}]`).value = data[item]
    })

    if (data.gender === 1) {
        console.log(1);
        const obj = document.querySelectorAll('[name="gender"]')
        obj[1].checked = true
        obj[0].checked = false
    }

    const { province: p, city: c, area: a } = data
    // select的value值必须在有列表之后才能选择，这里省份的列表已经初始化好了
    province.value = p
    // 城市列表是空的需要先用省份数据渲染，然后再选择值，地区同理
    let { list } = await axios.get('/api/city', { params: { pname: province.value } })
    city.innerHTML += list.map(item => {
        return `<option value="${item}">${item}</option>`
    })
    city.value = c

    let { list: list1 } = await axios.get('/api/area', { params: { pname: province.value, cname: city.value } })
    area.innerHTML += list1.map(item => {
        return `<option value="${item}">${item}</option>`
    })
    area.value = a

}
const editSubmit = async () => {
    const id = document.querySelector('.modal-title').dataset.id
    const data = serialize(form, { hash: true, empty: true })
    console.log(data);
    data.age = +data.age
    data.gender = +data.gender
    data.group = +data.group
    data.hope_salary = +data.hope_salary
    data.salary = +data.salary
    try {
        const msg = await axios.put(`/students/${id}`, data)
        showToast(msg.message)
        modal.hide()
        form.reset()
        render()
        // 清除自定义属性
        document.querySelector('.modal-title').dataset.id = ''
    }
    catch (err) {
        modal.hide()
        showToast('输入有误')
    }
}
