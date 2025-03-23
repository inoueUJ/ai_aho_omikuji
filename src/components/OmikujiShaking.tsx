import React from 'react';

export default function OmikujiShaking() {
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="omikuji-box relative">
        <div 
          className="w-32 h-40 bg-red-800 rounded-md flex items-center justify-center animate-shake relative overflow-hidden"
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-yellow-500 to-red-600">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">神社</span>
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center pt-6">
            <div className="w-20 h-24 bg-red-700 rounded flex items-center justify-center">
              <div className="w-3 h-20 bg-white rounded-full animate-shake-sticks"></div>
              <div className="w-3 h-16 bg-white rounded-full ml-1 animate-shake-sticks-delay"></div>
              <div className="w-3 h-18 bg-white rounded-full ml-1 animate-shake-sticks"></div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 animate-pulse">おみくじを選んでいます...</p>
    </div>
  );
}
