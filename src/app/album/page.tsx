'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Cate } from '@/types/app/album';
import { getAlbumCatePagingAPI } from '@/api/album';
import Masonry from 'react-masonry-css';
import './page.scss';

// 强制动态渲染，避免构建时 API 调用
export const dynamic = 'force-dynamic';

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  700: 2,
};

export default function AlbumPage() {
  const router = useRouter();

  const [list, setList] = useState<Cate[]>([]);

  const getAlbumCatePaging = async () => {
    const { data } = (await getAlbumCatePagingAPI(1, 9999)) || { data: {} as Paginate<Cate[]> };
    setList(data.result);
  };

  useEffect(() => {
    getAlbumCatePaging();
  }, []);

  const handleClick = (data: Cate) => {
    router.push(`/album/${data.id}?name=${data.name}`);
  };

  return (
    <>
      <title>📷 照片墙</title>
      <meta name="description" content="📷 照片墙" />

      <div className="container mx-auto px-4 py-8 pt-[90px]">
        <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid mb-12" columnClassName="masonry-grid_column">
          {list.map((cate, index) => (
            <motion.div key={cate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="mb-6">
              <div className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer" onClick={() => handleClick(cate)}>
                {/* 图片容器 */}
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img src={cate.cover || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=3840&q=100'} alt={cate.name} className="w-full h-full object-cover transform transition-transform  group-hover:scale-110" />
                </div>

                {/* 分类标签 */}
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm">{cate.name}</div>

                {/* 标题遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium text-lg">{cate.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>
      </div>
    </>
  );
}
