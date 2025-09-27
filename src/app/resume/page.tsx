import { Config } from '@/types/app/config';
import { getPageConfigDataByNameAPI } from '@/api/config';
import Resume from './resume';

export default async () => {
  // 安全处理 API 响应
  const { data } = (await getPageConfigDataByNameAPI('resume')) || { data: {} as Config };
  const resumeData = data?.value || {};

  return <Resume data={resumeData} />;
};
