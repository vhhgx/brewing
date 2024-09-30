import axios from 'axios'

// import.meta.env取自根目录的.env文件
const createService = (baseURL = import.meta.env.VITE_BASE_API) => {
  const service = axios.create({
    baseURL: baseURL, // 动态设置 API 根地址
    timeout: 5000,
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      console.error(error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response) => {
      const res = response.data
      if (res.code !== 200) {
        return Promise.reject(new Error(res.message || 'Error'))
        // return res
      } else {
        return res.data
      }
    },
    (error) => {
      console.error('err' + error)
      return Promise.reject(error)
    }
  )
  return service
}

export default createService
