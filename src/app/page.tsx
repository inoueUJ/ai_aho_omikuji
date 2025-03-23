'use client'

import { useState } from 'react'
import { Fortune } from '@/types/omikuji';
import QuestionForm from '@/components/QuestionForm';
import OmikujiShaking from '@/components/OmikujiShaking';
import OmikujiDrawing from '@/components/OmikujiDrawing';
import ResultContent from '@/components/ResultContent';
import ExplanationSection from '@/components/ExplanationSection';
import AppHeader from '@/components/AppHeader';

export default function Home() {
  const [appState, setAppState] = useState('initial'); // initial, shaking, drawing, result
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<Fortune | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const drawFortune = async () => {
    if (!question.trim()) {
      return;
    }
    
    setAppState('shaking');
    setIsLoading(true);
    
    try {
      // おみくじの動きをアニメーション表示するための遅延
      setTimeout(async () => {
        setAppState('drawing');
        
        try {
          // 実際のAPIを呼び出し
          const response = await fetch('/api/omikuji', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('おみくじAPIエラー:', errorData);
            throw new Error(errorData.error || 'おみくじを引く際にエラーが発生しました');
          }
          
          const fortune = await response.json();
          
          // 短い遅延の後に結果を表示（アニメーション効果のため）
          setTimeout(() => {
            setResult(fortune);
            setAppState('result');
            setIsLoading(false);
          }, 1000);
        } catch (error) {
          console.error('おみくじ取得エラー:', error);
          alert('おみくじを引く際にエラーが発生しました。もう一度お試しください。');
          setAppState('initial');
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('おみくじエラー:', error);
      setAppState('initial');
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAppState('initial');
    setQuestion('');
    setResult(null);
    setShowExplanation(false);
  };

  // 結果共有ボタンの処理（モック）
  const shareResult = () => {
    alert('結果をシェアしました！');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-red-50 to-orange-50 p-4 font-sans">
      {/* App header */}
      <AppHeader />

      {/* Main container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-6 relative">
        
        {/* Initial state - Ask a question */}
        {appState === 'initial' && (
          <QuestionForm 
            question={question}
            setQuestion={setQuestion}
            drawFortune={drawFortune}
            isLoading={isLoading}
          />
        )}

        {/* Shaking animation state */}
        {appState === 'shaking' && <OmikujiShaking />}

        {/* Drawing state */}
        {appState === 'drawing' && <OmikujiDrawing />}

        {/* Result state */}
        {appState === 'result' && result && (
          <div>
            <ResultContent question={question} result={result} />

            <ExplanationSection 
              level={result.level}
              showExplanation={showExplanation}
              setShowExplanation={setShowExplanation}
            />

            <div className="flex space-x-3 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                新しい質問
              </button>
              <button
                onClick={shareResult}
                className="flex-1 py-2 px-4 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700"
              >
                結果をシェア
              </button>
            </div>
          </div>
        )}

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
      </div>
    </div>
  );
}
