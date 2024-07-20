'use client';

import React, { useState, useEffect } from 'react';
import './lottery.css';
import { Button } from '@/components/ui/button';
import { BiRevision, BiSave } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

export default function LotteryComponent() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [stoppedBalls, setStoppedBalls] = useState<(number | null)[]>(Array(6).fill(null));
  const [resultsHistory, setResultsHistory] = useState<number[][]>([]);

  const router = useRouter();

  const handleClick = () => {
    setIsAnimating(true);
    setStoppedBalls(Array(6).fill(null)); // 새로운 애니메이션 시작 시 공 초기화
    setTimeout(() => {
      stopBalls();
    }, 3000);
  };

  const getRandomNumber = (existingNumbers: number[]) => {
    let number;
    do {
      number = Math.floor(Math.random() * 45) + 1;
    } while (existingNumbers.includes(number));
    return number;
  };

  const stopBalls = () => {
    let newNumbers: number[] = [];
    stoppedBalls.forEach((_, index) => {
      setTimeout(() => {
        setStoppedBalls((prev) => {
          const newState = [...prev];
          const newNumber = getRandomNumber(newNumbers);
          newState[index] = newNumber; // 랜덤 숫자 추가
          newNumbers.push(newNumber);

          if (index === stoppedBalls.length - 1) {
            setResultsHistory((prevResults) => [...prevResults, newNumbers]); // 결과를 결과 히스토리에 저장
            console.log('Results:', newNumbers); // 결과를 콘솔에 출력
          }
          return newState;
        });
      }, index * 300);
    });
  };

  const handleReset = () => {
    router.refresh();
    // setIsAnimating(false);
    // setStoppedBalls(Array(6).fill(null));
    // setResultsHistory([]);
  };

  const handleCopy = () => {
    const textToCopy = resultsHistory
      .map((resultSet, idx) => `${idx + 1}회차: ${resultSet.join(', ')}`)
      .join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert('로또 번호가 클립보드에 복사되었습니다.');
        })
        .catch((err) => {
          console.error('클립보드 접근이 거부되었습니다:', err);
          alert('클립보드 접근이 지원되지 않습니다. 수동으로 복사해 주세요.');
        });
    } else {
      // Fallback method using execCommand for mobile compatibility
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed'; // Avoid scrolling to bottom
      textArea.style.opacity = '0'; // Hide the element
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert('로또 번호가 클립보드에 복사되었습니다.');
        } else {
          alert('클립보드 접근이 지원되지 않습니다. 수동으로 복사해 주세요.');
        }
      } catch (err) {
        console.error('클립보드 복사 실패:', err);
        alert('클립보드 접근이 지원되지 않습니다. 수동으로 복사해 주세요.');
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    console.log('Updated Results History:', resultsHistory); // resultsHistory가 업데이트될 때마다 콘솔에 출력
  }, [resultsHistory]);

  return (
    <div className="pt-12 flex flex-col items-center justify-center w-screen">
      {/* <h2>LotteryPage</h2> */}

      {/* 추첨 에니메이션 */}
      <div className="flex gap-2 border-b-[1px] border-gray-400 pb-10">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="wrapper">
            <div
              className={`ball bg-gray-50 ${isAnimating && stoppedBalls[index] === null ? 'animate ' : ''} ${stoppedBalls[index] !== null ? 'stopped ' : ''}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {stoppedBalls[index] !== null && (
                <span className="number text-lg font-semibold">{stoppedBalls[index]}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <Button onClick={handleClick} className="mt-12 ">
        로또 번호 추첨하기
      </Button>

      {/* 설명 */}
      <p className="text-xs text-gray-600 mt-2">버튼을 누를때마다 번호가 추가 생성됩니다</p>

      {/* 결과 */}
      <div className="mt-12 ease-in-out duration-300 ">
        {/* <h3>로또 번호 모음</h3> */}
        {resultsHistory.length > 0 ? (
          <div className="flex flex-col gap-2 px-6 ">
            {resultsHistory.map((resultSet, resultSetIdx) => (
              <div className="grid grid-cols-10 items-center gap-4 " key={resultSetIdx}>
                <p className="col-span-2 text-start ">{resultSetIdx + 1}회차</p>
                <div className="col-span-8 grid grid-cols-6 gap-2">
                  {resultSet
                    .sort((a, b) => a - b)
                    .map((result, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 font-semibold text-center"
                      >
                        <span>{result}</span>
                      </div>
                    ))}
                </div>
                {/* <Button variant="outline" className="col-span-2">
                  저장
                </Button> */}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* 버튼들 */}
      {resultsHistory.length > 0 && (
        <div className="w-full mt-12 px-12 grid grid-cols-2 gap-4 ">
          <Button variant="outline" className="col-span-1 gap-2" onClick={handleReset}>
            <BiRevision /> 다시하기
          </Button>
          <Button variant="outline" className="col-span-1 gap-2" onClick={handleCopy}>
            <BiSave /> 복사하기
          </Button>
        </div>
      )}
    </div>
  );
}
