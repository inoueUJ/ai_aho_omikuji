'use client'

import React from 'react';
import { ChevronDown } from 'lucide-react';

type ExplanationProps = {
  level: string;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
};

export default function ExplanationSection({ level, showExplanation, setShowExplanation }: ExplanationProps) {
  return (
    <div className="pt-2">
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md text-gray-700"
      >
        <span>結果の解説</span>
        <ChevronDown className={`h-4 w-4 transform transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
      </button>
      
      {showExplanation && (
        <div className="mt-3 p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
          <p>「{level}」は伝統的なおみくじの運勢レベルの一つです。今回のあなたの質問に対して、AIは日本の伝統的なおみくじの形式を取り入れながら、現代的なアドバイスを提供しました。</p>
          <p className="mt-2">このアドバイスはAnthropicのAI（Claude）によって生成されています。おみくじのジョークは、少し緊張をほぐすためのものです。真面目に受け止めすぎず、参考程度にお楽しみください！</p>
        </div>
      )}
    </div>
  );
}
