import React from 'react';

export default function OmikujiDrawing() {
  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-4 h-48 bg-white border border-gray-200 rounded shadow-md animate-pull-omikuji">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="w-4 h-12 bg-red-600 rounded-b"></div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-gray-600">おみくじを開いています...</p>
    </div>
  );
}
