import fs from 'fs';
import { join } from 'path';

export const showBanner = () => {
  const bannerPath = join(__dirname, 'resources', 'banner.txt');
  // 判断文件是否存在
  if (fs.existsSync(bannerPath)) {
    const banner = fs.readFileSync(bannerPath, 'utf-8');
    console.log(banner);
  }
};
