'use client';

import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@heroui/react';
import { getFootprintListAPI } from '@/api/footprint';
import { Footprint } from '@/types/app/footprint';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import dayjs from 'dayjs';
import Masonry from 'react-masonry-css';
import { getGaodeMapConfigDataAPI } from '@/api/config';
import './page.scss';

// 强制动态渲染，避免构建时 API 调用
export const dynamic = 'force-dynamic';

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  700: 2,
};

export default function MapContainer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDismissable, setIsDismissable] = useState(true);
  const [list, setList] = useState<Footprint[]>([]);
  const [data, setData] = useState<Footprint>({} as Footprint);
  let map: any = null;
  let infoWindow: any = null;

  const getFootprintList = async () => {
    const { data } = (await getFootprintListAPI()) || { data: [] as Footprint[] };
    setList(data);
  };

  useEffect(() => {
    getFootprintList();
  }, []);

  useEffect(() => {
    if (!list.length) return;

    // 确保代码仅在客户端执行
    import('@amap/amap-jsapi-loader').then(async (AMapLoader) => {
      const { data } = (await getGaodeMapConfigDataAPI()) || { data: {} };
      const { key_code, security_code } = data as { key_code: string; security_code: string };

      (window as any)._AMapSecurityConfig = {
        securityJsCode: security_code,
      };

      AMapLoader.load({
        key: key_code,
        version: '2.0',
        plugins: ['AMap.Scale', 'AMap.Marker', 'AMap.InfoWindow'],
      })
        .then((AMap) => {
          map = new AMap.Map('container', {
            mapStyle: 'amap://styles/grey',
            viewMode: '3D',
            zoom: 4.8,
            center: [105.625368, 37.746599],
          });

          // 创建信息窗体
          infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30),
            autoMove: true,
            anchor: 'bottom-center',
            isCustom: true, // 使用自定义窗体
          });

          // 点击地图任意位置时关闭信息窗体
          map.on('click', () => {
            infoWindow.close();
          });

          // 遍历 locations 数组，创建标记
          list?.forEach((data) => {
            const marker = new AMap.Marker({
              position: data?.position.split(','),
              map: map,
              content:
                data?.images[0] &&
                `
                            <div style="display: flex; justify-content: center; align-items: center; background-color: #fff; width: 35px; height: 35px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.4); animation: pulse 2s infinite;">
                                <img src="${data?.images[0]}" alt="" style="width: 90%; height: 90%; border-radius: 50%;">
                            </div>
                            <style>
                                @keyframes pulse {
                                    0% {
                                        box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.4);
                                    }
                                    50% {
                                        box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
                                    }
                                    100% {
                                        box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.4);
                                    }
                                }
                            </style>
                            `,
            });

            // 点击标记时，显示信息窗体并定位到该位置
            marker.on('click', () => {
              const content = `
                                <div style="border-radius: 12px; overflow: hidden; width: 240px; margin-top: 25px; margin-left: 20px;">
                                    <div style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden; border-radius: 12px;">
                                        <img src="${data?.images[0]}" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); padding: 20px; display: flex; flex-direction: column;">
                                            <h2 style="color: white; margin: 0; font-size: 24px; font-weight: 600; margin-bottom: 12px;">${data?.title}</h2>

                                            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                                                <div style="display: flex; align-items: center; color: rgba(255,255,255,0.8); font-size: 13px;">
                                                    <span>
                                                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 6px; fill: currentColor;">
                                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                                                        </svg>
                                                    </span>
                                                   
                                                    <span>${dayjs(+data?.createTime).format('YYYY-MM-DD HH:mm')}</span>
                                                </div>

                                                <div style="display: flex; align-items: center; color: rgba(255,255,255,0.8); font-size: 13px;">
                                                     <span>
                                                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 6px; fill: currentColor;">
                                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                        </svg>
                                                     </span>
                                                     
                                                    <span>${data?.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style="margin-top: 5px; border-radius: 12px; overflow: hidden;">
                                        <button 
                                            data-id="${data.id}"
                                            onclick="document.querySelector('[data-id=\\'${data.id}\\']').dispatchEvent(new CustomEvent('openModal', {bubbles: true}))"
                                            style="display: flex; width: 100%; padding: 12px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border: none; color: white; font-size: 14px; cursor: pointer; align-items: center; justify-content: center; transition: all 0.3s ease;"
                                            onmouseover="this.style.background='rgba(255,255,255,0.35)'; this.style.transform='scale(1.05)';"
                                            onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)';"
                                        >
                                            查看更多 
                                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-left: 4px; fill: currentColor;">
                                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `;
              infoWindow.setContent(content);
              infoWindow.open(map, marker.getPosition());
              setData(data);
              // 设置地图中心点和缩放级别
              map.setCenter(marker.getPosition());
              map.setZoom(15);
            });
          });

          // 监听自定义事件来打开 Modal
          document.addEventListener('openModal', (event) => {
            const button = event.target as HTMLElement;
            const id = button.getAttribute('data-id');
            if (id) {
              const targetData = list.find((item) => item.id === Number(id));
              if (targetData) {
                setData(targetData);
                onOpen();
              }
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });

      return () => {
        map?.destroy();
        infoWindow?.destroy();
      };
    });
  }, [list]);

  return (
    <>
      <title>⛳️ 那年走过的路</title>
      <meta name="description" content="⛳️ 那年走过的路" />
      <div id="container"></div>

      <Modal
        size="4xl"
        backdrop="opaque"
        isDismissable={isDismissable}
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (isDismissable || !open) onOpenChange();
        }}
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent className="bg-[rgba(36,40,45,0.9)]">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-2 text-white">{data?.title}</ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <div className="flex flex-col justify-between w-full mb-8">
                    <p className="overflow-auto max-h-[210px] text-[#d6d6d6] px-[5px]">{data?.content}</p>
                    <div className="text-sm text-end text-[#a5a5a5] pt-2">
                      <p>时间：{dayjs(+data?.createTime).format('YYYY-MM-DD HH:mm')}</p>
                      <p>地址：{data?.address}</p>
                    </div>
                  </div>

                  <div className={`overflow-auto flex justify-center w-full ${data?.images.length !== 1 ? 'max-h-96' : ''} mb-5 hide_sliding`}>
                    <PhotoProvider
                      speed={() => 800}
                      easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                      onVisibleChange={(visible) => {
                        setIsDismissable(!visible);
                      }}
                    >
                      <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid mb-12" columnClassName="masonry-grid_column">
                        {data?.images?.map((item, index) => (
                          <PhotoView src={item} key={index}>
                            <img src={item} alt="" className="rounded-2xl w-full mb-3 cursor-pointer" />
                          </PhotoView>
                        ))}
                      </Masonry>
                    </PhotoProvider>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
