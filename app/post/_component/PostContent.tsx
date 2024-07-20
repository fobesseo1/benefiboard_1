'use client';

import { useState, useEffect } from 'react';

const PostContent = ({ content, contentType }: { content: string; contentType: string }) => {
  const [sanitizedContent, setSanitizedContent] = useState(content);

  useEffect(() => {
    if (contentType === 'html' && typeof window !== 'undefined') {
      import('dompurify').then((DOMPurify) => {
        setSanitizedContent(DOMPurify.default.sanitize(content));
      });
    }
  }, [content, contentType]);

  if (contentType === 'html') {
    return (
      <section className="flex flex-col my-6 gap-8">
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className="leading-normal" />
      </section>
    );
  } else {
    return (
      <section className="flex flex-col my-6 gap-8">
        <p className="leading-normal whitespace-pre-wrap break-words">{content}</p>
      </section>
    );
  }
};

export default PostContent;
