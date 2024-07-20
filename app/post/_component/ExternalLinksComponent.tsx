'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ExternalLinksProps {
  linkUrl1?: string;
  linkUrl2?: string;
}

const isYouTubeUrl = (url: string) => {
  const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
};

export default function ExternalLinks({ linkUrl1, linkUrl2 }: ExternalLinksProps) {
  const [iframeSrc1, setIframeSrc1] = useState<string | null>(null);
  const [iframeSrc2, setIframeSrc2] = useState<string | null>(null);
  const [isYouTube1, setIsYouTube1] = useState<boolean>(false);
  const [isYouTube2, setIsYouTube2] = useState<boolean>(false);

  useEffect(() => {
    if (linkUrl1) {
      const embedUrl1 = isYouTubeUrl(linkUrl1) ? getYouTubeEmbedUrl(linkUrl1) : linkUrl1;
      setIframeSrc1(embedUrl1);
      setIsYouTube1(isYouTubeUrl(linkUrl1));
    }

    if (linkUrl2) {
      const embedUrl2 = isYouTubeUrl(linkUrl2) ? getYouTubeEmbedUrl(linkUrl2) : linkUrl2;
      setIframeSrc2(embedUrl2);
      setIsYouTube2(isYouTubeUrl(linkUrl2));
    }
  }, [linkUrl1, linkUrl2]);

  return (
    <div className="flex flex-col gap-6 lg:max-w-[948px] lg:mx-auto">
      {iframeSrc1 && (
        <div className="flex flex-col mb-4 w-full">
          <div
            className="w-full"
            style={{
              paddingTop: isYouTube1 ? '56.25%' : '0',
              height: isYouTube1 ? '0' : '640px',
              position: 'relative',
            }}
          >
            <iframe
              src={iframeSrc1}
              style={{
                width: '100%',
                height: isYouTube1 ? '100%' : '640px',
                position: isYouTube1 ? 'absolute' : 'static',
                top: '0',
                left: isYouTube1 ? '50%' : '0',
                transform: isYouTube1 ? 'translateX(-50%)' : 'none',
              }}
              title="외부 링크 1"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
          </div>
          <div className="flex flex-col gap-1 justify-center py-4 pl-2 w-full border-y-[1px] border-gray-200">
            <h2 className="font-semibold">
              외부링크 1.{' '}
              <span className="text-xs font-light tracking-tighter pl-1">
                ▷아래 링크 클릭시 해당 링크로 이동
              </span>
            </h2>
            {linkUrl1 && (
              <Link href={linkUrl1}>
                <p className="text-sm text-gray-600 underline line-clamp-1">{linkUrl1}</p>
              </Link>
            )}
          </div>
        </div>
      )}

      {iframeSrc2 && (
        <div className="flex flex-col mb-4 w-full">
          <div
            className="w-full"
            style={{
              paddingTop: isYouTube2 ? '56.25%' : '0',
              height: isYouTube2 ? '0' : '640px',
              position: 'relative',
            }}
          >
            <iframe
              src={iframeSrc2}
              style={{
                width: '100%',
                height: isYouTube2 ? '100%' : '640px',
                position: isYouTube2 ? 'absolute' : 'static',
                top: '0',
                left: isYouTube2 ? '50%' : '0',
                transform: isYouTube2 ? 'translateX(-50%)' : 'none',
              }}
              title="외부 링크 2"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
          </div>
          <div className="flex flex-col gap-1 justify-center py-4 pl-2 w-full border-y-[1px] border-gray-200">
            <h2 className="font-semibold">
              외부링크 2.{' '}
              <span className="text-xs font-light tracking-tighter pl-1">
                ▷아래 링크 클릭시 해당 링크로 이동
              </span>
            </h2>
            {linkUrl2 && (
              <Link href={linkUrl2}>
                <p className="text-sm text-gray-600 underline line-clamp-1">{linkUrl2}</p>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
