import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollUp() {
  const { pathname } = useLocation();
  const scrollUp =()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    scrollUp()
  }, [pathname]);
  return null;
}