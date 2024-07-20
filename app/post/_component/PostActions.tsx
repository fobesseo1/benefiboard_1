import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PostActions = ({ id, onConfirmDelete }: { id: string; onConfirmDelete: () => void }) => (
  <div className="grid grid-cols-2 items-center gap-2 w-full h-12">
    <Button variant="outline" asChild>
      <Link href={`/post/edit/${id}`}>수정하기</Link>
    </Button>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">삭제하기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end space-x-2">
          <DialogTrigger asChild>
            <Button variant="outline">취소</Button>
          </DialogTrigger>
          <Button variant="destructive" onClick={onConfirmDelete}>
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);

export default PostActions;
