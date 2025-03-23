
export type Fortune = {
  level: string;
  color: string;
  advice: string;
  message?: string; // 神社っぽいメッセージ（新規追加）
  joke?: string;    // 既存のjoke項目も残す（後方互換性のため）
};

// おみくじの運勢レベルとそれに対応する色のマッピング
export const fortuneLevels = [
  { level: '大吉', color: '#E53E3E' },
  { level: '中吉', color: '#DD6B20' },
  { level: '小吉', color: '#D69E2E' },
  { level: '末吉', color: '#38A169' },
  { level: '凶', color: '#3182CE' }
];

// 簡易的なキャッシュのための型
export type CacheEntry = {
  timestamp: number;
  data: Fortune;
};

export type OmikujiCache = Map<string, CacheEntry>;
