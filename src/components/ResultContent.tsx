'use client'

import React from 'react';
import { MessageSquare, Zap } from 'lucide-react';

type ResultContentProps = {
  question: string;
  result: {
    level: string;
    color: string;
    advice: string;
    message?: string;
    joke?: string;
  };
}

export default function ResultContent({ question, result }: ResultContentProps) {
  // messageプロパティがあればそれを使い、なければjokeプロパティを使用
  const messageOrJoke = result.message || result.joke;
  
  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold animate-result-appear"
          style={{ backgroundColor: result.color }}
        >
          {result.level}
        </div>
        <h2 className="text-xl font-bold mt-2">{question}</h2>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="min-w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <Zap className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">アドバイス</h3>
            <p className="text-gray-600 mt-1">{result.advice}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="min-w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">神託</h3>
            <p className="text-gray-600 mt-1 font-serif">{messageOrJoke}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
