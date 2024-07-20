'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createPost } from '../_action/post';
import { categories, childCategoriesArray, parentCategoriesArray } from '../_action/category';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export type UserPropsType = {
  user_id: string;
  user_name?: string;
  user_email?: string;
  user_avatar_url?: string;
  initialParentCategoryId?: string;
};

export default function PostForm({
  user_id,
  user_name,
  user_avatar_url,
  user_email,
  initialParentCategoryId,
}: UserPropsType) {
  const [parentCategoryId, setParentCategoryId] = useState<string>(
    initialParentCategoryId || 'default'
  );
  const [childCategoryId, setChildCategoryId] = useState<string>('default');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [contentType, setContentType] = useState<string>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidCategoryId = (id: string) => {
    return categories.some((category) => category.id === id);
  };

  const handleParentCategoryChange = (value: string) => {
    setParentCategoryId(value);
    setChildCategoryId('default');
  };

  const handleChildCategoryChange = (value: string) => {
    setChildCategoryId(value);
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, 5);
      const validImages = fileArray.filter(
        (file) => file.size > 0 && file.type.startsWith('image/')
      );
      setImages((prevImages) => [...prevImages, ...validImages]);
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...validImages.map((file) => URL.createObjectURL(file)),
      ]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const totalFormData = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    images.forEach((image) => {
      if (
        image.size > 0 &&
        !Array.from(formData.entries()).some(
          ([key, value]) =>
            key === 'images' &&
            (value as File).name === image.name &&
            (value as File).size === image.size
        )
      ) {
        formData.append('images', image);
      }
    });

    formData.append('user_id', user_id);
    if (user_name) formData.append('user_name', user_name);
    if (user_avatar_url) formData.append('user_avatar_url', user_avatar_url);
    if (user_email) formData.append('user_email', user_email);

    formData.append(
      'parent_category_id',
      isValidCategoryId(parentCategoryId) && parentCategoryId !== 'default' ? parentCategoryId : ''
    );
    formData.append(
      'child_category_id',
      isValidCategoryId(childCategoryId) && childCategoryId !== 'default' ? childCategoryId : ''
    );

    formData.append('content_type', contentType);

    console.log('Form Data:', Object.fromEntries(formData));

    await createPost(formData);
  };

  const parentCategories = [
    { id: 'default', name: '메인 카테고리 선택' },
    ...parentCategoriesArray,
  ];
  const childCategories = [{ id: 'default', name: '서브 카테고리 선택' }, ...childCategoriesArray];

  return (
    <div className="mt-4 mx-auto px-6 lg:w-[948px]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">포스트 작성 페이지</h1>
      <form onSubmit={totalFormData} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contentType">
            포스트 타입 <span className="text-xs text-gray-400">＊일반/HTML＊</span>
          </Label>
          <Select value={contentType} onValueChange={handleContentTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Content Type" />
            </SelectTrigger>
            <SelectContent className="max-h-48 overflow-y-auto">
              <SelectItem value="text">일반</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input type="text" name="title" id="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">내용</Label>
          {contentType === 'text' ? (
            <Textarea name="content" id="content" required />
          ) : (
            <Textarea name="content" id="content" required />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="parent_category">
            메인 카테고리 <span className="text-xs text-gray-400">＊대분류＊</span>
          </Label>
          <Select value={parentCategoryId} onValueChange={handleParentCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="메인 카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="max-h-48 overflow-y-auto">
              {parentCategories.map((category) => (
                <SelectItem key={category.id || 'NULL'} value={category.id || 'NULL'}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="child_category">
            서브 카테고리 <span className="text-xs text-gray-400">＊소분류＊</span>
          </Label>
          <Select value={childCategoryId} onValueChange={handleChildCategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="서브 카테고리 선택" />
            </SelectTrigger>
            <SelectContent className="max-h-48 overflow-y-auto">
              {childCategories.map((category) => (
                <SelectItem key={category.id || 'NULL'} value={category.id || 'NULL'}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">이미지 (최대 5개)</Label>
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
                onClick={() => handleImageRemove(index)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkUrl1">외부 Url #1</Label>
          <Input type="text" name="linkUrl1" id="linkUrl1" />
          <Label htmlFor="linkUrl2">외부 Url #2</Label>
          <Input type="text" name="linkUrl2" id="linkUrl2" />
        </div>
        <Button type="submit">포스트 작성</Button>
      </form>
    </div>
  );
}
