// 最新调整：在 .env 文件中配置项目后端 API 地址
const url = process.env.NEXT_PUBLIC_PROJECT_API || '/api'
const baseUrl = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_PROJECT_API || 'http://localhost:9003/api'
    : url
// 配置页面缓存时间
const cachingTime = +(process.env.NEXT_PUBLIC_CACHING_TIME || '300')!

export default async <T>(method: string, api: string, data?: any, caching = true) => {
    try {
        // 确保 URL 拼接正确
        let fullUrl: string;
        if (baseUrl.endsWith('/') && api.startsWith('/')) {
            fullUrl = baseUrl + api.slice(1);
        } else if (!baseUrl.endsWith('/') && !api.startsWith('/')) {
            fullUrl = baseUrl + '/' + api;
        } else {
            fullUrl = baseUrl + api;
        }

        // 确保 URL 是完整的
        if (fullUrl.startsWith('/api') && typeof window === 'undefined') {
            // 在服务器端，给相对路径添加协议和主机
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
            const host = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost'
            const port = process.env.NODE_ENV === 'production' ? '' : ':3000'
            fullUrl = `${protocol}://${host}${port}${fullUrl}`
        }

        const res = await fetch(fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            [method === 'POST' ? 'body' : '']: JSON.stringify(data ? data : {}),
            next: { revalidate: caching ? cachingTime : 1 }
        })

        return res?.json() as Promise<ResponseData<T>>;
    } catch (error) {
        console.log('捕获到异常：', error);
    }
}
