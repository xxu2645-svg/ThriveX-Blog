import { getPageConfigDataByNameAPI } from '@/api/config';
import { Config } from '@/types/app/config';

interface Equipment {
  category: string;
  description: string;
  items: { name: string; description: string; price: string; image: string; color: string }[];
}

export default async () => {
  const { data } = (await getPageConfigDataByNameAPI('equipment')) || { data: {} as Config };

  // 安全处理 API 响应
  const list: Equipment[] = data?.value?.list || [];

  if (!list.length) {
    return (
      <>
        <title>🔭 我的设备 - 工欲善其事必先利其器</title>
        <meta name="description" content="🔭 分享我的生产力工具" />
        <div className="pt-20 pb-10">
          <div className="w-[90%] lg:w-[1200px] mx-auto mt-10">
            <div className="text-center text-gray-500">
              <p>暂无设备信息</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>🔭 我的设备 - 工欲善其事必先利其器</title>
      <meta name="description" content="🔭 分享我的生产力工具" />

      <div className="pt-20 pb-10">
        <div className="w-[90%] lg:w-[1200px] mx-auto mt-10 space-y-20 md:space-y-24">
          {list.map((group: Equipment, index: number) => (
            <div key={index}>
              <h2 className="text-xl">{group.category}</h2>
              <p className="text-gray-600 mb-6">{group.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.items.map((item: { name: string; description: string; price: string; image: string; color: string }, idx: number) => (
                  <div key={idx} className="group overflow-hidden border rounded-lg bg-white dark:bg-black-a transform transition-transform hover:scale-105 cursor-pointer">
                    <div className="flex justify-center h-40" style={{ backgroundColor: item.color }}>
                      <img src={item.image} alt={item.name} className="h-full object-cover" />
                    </div>

                    <div className="p-4">
                      <h3 className="group-hover:text-primary  ">{item.name}</h3>
                      <p className="text-gray-500 text-sm pt-2 mb-4 line-clamp-2">{item.description}</p>
                      <span className="mt-2 py-1 px-1.5 rounded-md text-white bg-gray-300 group-hover:bg-primary  ">￥{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
