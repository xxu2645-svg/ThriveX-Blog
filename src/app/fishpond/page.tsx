'use client';

import { useState, useEffect } from 'react';
import { Rss } from '@/types/app/rss';
import { getRssListAPI } from '@/api/rss';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import RandomAvatar from '@/components/RandomAvatar';
import parse from 'html-react-parser';
import { HTMLParser } from '@/utils/htmlParser';
import Masonry from 'react-masonry-css';
import '@/components/ArticleLayout/Waterfall/index.scss';
import { dayFormat } from '@/utils';

// 强制动态渲染，避免构建时 API 调用
export const dynamic = 'force-dynamic';

// 瀑布流断点配置
const breakpointColumnsObj = {
  default: 5,
  1450: 4,
  1350: 3,
  1024: 2,
  768: 1,
};

export default function FishpondPage() {
  const [rssData, setRssData] = useState<Rss[] | null>(null);
  const [loading, setLoading] = useState(true);

  const getRssList = async () => {
    try {
      setLoading(true);
      const response = await getRssListAPI();

      if (response?.data) {
        setRssData(response.data);
      }
    } catch (error) {
      console.error('获取RSS数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRssList();
  }, []);

  // 渲染内容组件
  const ContentRenderer = ({ content, mode = 'html' }: { content: string; mode?: 'html' | 'text' }) => {
    if (mode === 'text') {
      const summary = HTMLParser.getSummary(content, 150);
      return <p className="m-0 my-2 text-sm leading-6 text-[#666] text-justify">{summary.text}</p>;
    }

    // HTML模式：安全渲染
    const cleanHTML = HTMLParser.sanitize(content, {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'span', 'div'],
      allowedAttributes: ['href', 'target', 'rel'],
      maxLength: 150,
    });

    return <div className="m-0 my-2 text-sm leading-6 text-[#666] dark:text-gray-400 text-justify">{parse(cleanHTML)}</div>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <title>🐟 鱼塘</title>
      <meta name="description" content="🐟 鱼塘" />

      <div className="w-full pt-20">
        <h2 className="text-center text-5xl py-8">鱼塘</h2>

        <div>
          {rssData && rssData.length > 0 ? (
            <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid pl-10 pr-4" columnClassName="masonry-grid_column">
              {rssData.map((item, index) => {
                return (
                  <div key={`${item.url}-${index}`} className="border border-[#eee] dark:border-black-b rounded-md transition-shadow hover:shadow-[0_2px_8px_rgba(186,186,186,0.15)] bg-white dark:bg-black-b p-5 pb-3 hover:-translate-y-0.5 transition-transform mb-3 break-inside-avoid">
                    <div className="flex justify-between items-center mb-3.75">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#eee] dark:border-black-b">{item.image ? <img src={item.image} alt="avatar" className="w-full h-full object-cover" /> : <RandomAvatar className="w-full h-full rounded-full" />}</div>

                        <div className="text-sm font-medium text-[#333]">{item.email ? item.email.split('@')[0] : '匿名用户'}</div>
                      </div>

                      <div className="text-xs text-[#666] dark:text-gray-300 opacity-80">{item.createTime ? dayFormat(item.createTime) : ''}</div>
                    </div>

                    <div>
                      <h3 className="m-0 my-3 text-lg font-semibold leading-6">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#333] dark:text-white no-underline   hover:text-[#539dfd]">
                          {item.title}
                        </a>
                      </h3>

                      <ContentRenderer content={item.description} />
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#eee] dark:border-black-b">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-white text-xs rounded-full font-medium">{item.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Masonry>
          ) : (
            <Empty info="暂无友链动态" />
          )}
        </div>
      </div>
    </>
  );
}
