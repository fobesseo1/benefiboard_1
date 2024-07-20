// MessageFilter.tsx

'use client';

interface MessageFilterProps {
  filter: 'received' | 'sent' | 'starred';
  setFilter: (filter: 'received' | 'sent' | 'starred') => void;
}

const MessageFilter: React.FC<MessageFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="grid grid-cols-3 h-12 ">
      <div
        className={`bg-white border-b-[1px] flex justify-center items-center cursor-pointer ${
          filter === 'received' ? 'border-gray-400 font-bold' : 'border-gray-200'
        }`}
        onClick={() => setFilter('received')}
      >
        <p className="text-center">받은 쪽지</p>
      </div>
      <div
        className={`bg-white border-b-[1px] flex justify-center items-center cursor-pointer ${
          filter === 'sent' ? 'border-gray-400 font-bold' : 'border-gray-200'
        }`}
        onClick={() => setFilter('sent')}
      >
        <p className="text-center">보낸 쪽지</p>
      </div>
      <div
        className={`bg-white border-b-[1px] flex justify-center items-center cursor-pointer ${
          filter === 'starred' ? 'border-gray-400 font-bold' : 'border-gray-200'
        }`}
        onClick={() => setFilter('starred')}
      >
        <p className="text-center">보관함</p>
      </div>
    </div>
  );
};

export default MessageFilter;
