const Breadcrumbs = ({ category }: { category: string }) => (
  <div className="flex gap-1 items-center h-10 border-b-[1px] border-gray-200 ">
    <p className="leading-tight text-sm text-gray-600">포럼 {'>'}</p>
    <p className="leading-tight text-sm font-bold text-gray-600">{category || '자유게시판'}</p>
  </div>
);

export default Breadcrumbs;
