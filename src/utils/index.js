import axios from 'axios'

// 创建axios实例
const service = axios.create({
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['Cookie'] = 'webid=803a69163c11407686fd0f7426128c90; SLEVEL=0; ssab=; HM_CU=5Cdf2TCZZwc; PROF=0603012024024044024108UiQPJk7X-6w0-zE35fE7EtWDTWO2pljEtw00KuZP3z7wEl2bxriNh5SdkQ00HhOTWRadPF-WB8LR5EuQHkKNaj__7IUOGS4fSOaCEDI0fIauQlo8OTLcCscrxJX8Uw00Voisr2G29DEK2uPH_uXvTNpj-9JnhJLU9sWaBq7UvGEfHyWPXSOBjLGcc3BUTlVuoPvGyljqHzPEGIUGArPPNDlYKMWVofRrvVWOMMrX6us0; AGEN=hSZlrTARLMoTqsnwwW1tzg; CCSCK=1Uo9cSB.j.7rdfudaTFzSITADFZKzS_8YIYmehqWWqQf1Wpjt4MRdA0028872f86888223e388e18554db1a77dc0; VISIT_CZZwc="1Wfj1,1Rdub,1X02B,1Ptdy"; TS=1549552438; HTS=2KXQFO1-FTW-gxF.Sow3Nw00; LSID=fc62f287-306a-4062-afcb-e8f6b9895c3a1549552438855; alimcnt1Wfj1=0; webid_sync=1549552439520; TIARA=ntsssJYJvHI8Xw14TG7OEtgNI1Xc7aIQrQLN5GxGOkmRpVZ9qXPawwYHdKquuAFVew_RYk2cLo1LxBYpeDxtbyNKYQok.k13'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

export default service
