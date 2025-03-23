'use client'

import React from 'react';
import { RefreshCw } from 'lucide-react';

type QuestionFormProps = {
  question: string;
  setQuestion: (question: string) => void;
  drawFortune: () => void;
  isLoading: boolean;
};

export default function QuestionForm({ question, setQuestion, drawFortune, isLoading }: QuestionFormProps) {
  const MAX_LENGTH = 50;
  
  // 例の質問をクリックして設定する関数
  const selectExampleQuestion = (exampleQuestion: string) => {
    // 最大文字数制限を考慮
    setQuestion(exampleQuestion.slice(0, MAX_LENGTH));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          あなたの悩みや質問を入力してください
        </label>
        <textarea
          id="question"
          rows={4}
          maxLength={MAX_LENGTH}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`例: 「新しい趣味を始めるべきか迷っています...」（最大${MAX_LENGTH}文字）`}
        />
        <div className="text-right text-xs text-gray-500">
          {question.length}/{MAX_LENGTH}文字
        </div>
      </div>
      
      <button
        onClick={drawFortune}
        disabled={!question.trim() || isLoading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
          question.trim() && !isLoading ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400'
        }`}
      >
        <span>おみくじを引く</span>
        {!isLoading && <RefreshCw className="h-4 w-4" />}
      </button>

      {/* Recent examples */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">最近の質問例</h3>
        <div className="space-y-2">
          <div 
            className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
            onClick={() => selectExampleQuestion('仕事を変えるべきか悩んでいます...')}
          >
            「仕事を変えるべきか悩んでいます...」
          </div>
          <div 
            className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
            onClick={() => selectExampleQuestion('友達の結婚式、何を着ていくべき？')}
          >
            「友達の結婚式、何を着ていくべき？」
          </div>
          <div 
            className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
            onClick={() => selectExampleQuestion('彼にサプライズしたいけど何がいい？')}
          >
            「彼にサプライズしたいけど何がいい？」
          </div>
        </div>
      </div>
    </div>
  );
}
