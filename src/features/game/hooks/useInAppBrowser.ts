import { useState, useEffect } from 'react';

type OSType = 'ANDROID' | 'IOS' | 'OTHER';

export const useInAppBrowser = () => {
    const [isInApp, setIsInApp] = useState(false);
    const [osType, setOsType] = useState<OSType>('OTHER');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const ua = navigator.userAgent.toLowerCase();

        // 인앱 브라우저 식별 문자열 (카카오톡, 라인, 페이스북, 인스타그램, 네이버앱 등)
        const inAppKeywords = [
            'kakaotalk',
            'line',
            'inapp',
            'naver',
            'instagram',
            'facebook',
            'daum',
            'whale'
        ];

        const checkIsInApp = inAppKeywords.some(keyword => ua.includes(keyword));
        setIsInApp(checkIsInApp);

        // OS 판별
        if (/iphone|ipad|ipod/i.test(ua)) {
            setOsType('IOS');
        } else if (/android/i.test(ua)) {
            setOsType('ANDROID');
        } else {
            setOsType('OTHER');
        }

    }, []);

    return { isInApp, osType };
};
