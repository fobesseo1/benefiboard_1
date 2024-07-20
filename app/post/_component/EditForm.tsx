'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { fetchPostById, updatePostById } from '../_action/post';
import { UserPropsType } from './PostForm';

export default function EditForm({ user_id, user_name, user_avatar_url }: UserPropsType) {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl1, setLinkUrl1] = useState('');
  const [linkUrl2, setLinkUrl2] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await fetchPostById(id);
      console.log('editData', data);
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setLinkUrl1(data.linkUrl1 || '');
      setLinkUrl2(data.linkUrl2 || '');
      setImagePreviews(data.images || []);
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, 5); // 최대 5개 이미지
      const validImages = fileArray.filter(
        (file) => file.size > 0 && file.type.startsWith('image/')
      );
      setImages((prevImages) => [...prevImages, ...validImages]);
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...validImages.map((file) => URL.createObjectURL(file)),
      ]);

      // 파일 인풋을 리셋하여 중복 추가를 방지합니다.
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setDeletedImages((prev) => [...prev, imagePreviews[index]]);
      setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    }
  };

  const editPost = async (event: FormEvent) => {
    event.preventDefault();
    if (user_id !== post.author_id) {
      console.log('You are not authorized to edit this post.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('linkUrl1', linkUrl1);
    formData.append('linkUrl2', linkUrl2);

    images.forEach((image) => {
      if (image.size > 0) {
        formData.append('images', image);
      }
    });

    formData.append('deletedImages', JSON.stringify(deletedImages));

    await updatePostById(formData, id, user_id);

    console.log('Post updated');
    router.push('/post');
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-4 mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">컨텐츠 수정 페이지</h1>
      <form onSubmit={editPost} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            name="content"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">Images (최대 5개)</Label>
          <Input
            type="file"
            name="images"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
        <div className="flex space-x-2">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative w-24 h-24">
              <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleImageRemove(index, index < post.images.length)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkUrl1">외부 Url #1</Label>
          <Input
            type="text"
            name="linkUrl1"
            id="linkUrl1"
            value={linkUrl1}
            onChange={(e) => setLinkUrl1(e.target.value)}
          />
          <Label htmlFor="linkUrl2">외부 Url #2</Label>
          <Input
            type="text"
            name="linkUrl2"
            id="linkUrl2"
            value={linkUrl2}
            onChange={(e) => setLinkUrl2(e.target.value)}
          />
        </div>
        <Button type="submit">Edit Post</Button>
      </form>
    </div>
  );
}
