const TitleComponent = ({ title }: { title: string }) => (
  <div className="flex gap-1 items-center h-10 border-b-[1px] border-gray-200 py-2">
    <p className="leading-tight text-sm text-gray-600">행운의 숫자 {'>'}</p>
    <p className="leading-tight text-sm font-bold text-gray-600">{title}</p>
  </div>
);
export default TitleComponent;
