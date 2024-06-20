import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/home': '首頁',
  '/post': '貼文',
  '/search': '搜尋',
  '/notification': '通知',
  '/profile': '個人資料',
  '/sign-in': '登入',
};

function usePageTitle() {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const title = routeTitles[`/${path}`] || '作品集';
    document.title = title;
  }, [location]);
}

export default usePageTitle;
