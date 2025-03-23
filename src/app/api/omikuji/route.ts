import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { fortuneLevels, OmikujiCache, CacheEntry } from '@/types/omikuji';

// シンプルなインメモリキャッシュ（実際のプロダクションではRedisなどを使用するべき）
const cache: OmikujiCache = new Map();

// キャッシュの有効期限（24時間 = 86400000ミリ秒）
const CACHE_TTL = 86400000;

// 最大文字数制限
const MAX_QUESTION_LENGTH = 50;

// 質問を前処理して標準化する関数
function preprocessQuestion(question: string): string {
  // 質問を標準化（余計な表現を削除、文字数制限）
  let processed = question
    .replace(/どうすれば良いでしょうか\？/g, "？")
    .replace(/私は|私が|私の/g, "")
    .trim();
  
  // 最大文字数制限
  if (processed.length > MAX_QUESTION_LENGTH) {
    processed = processed.substring(0, MAX_QUESTION_LENGTH);
  }
  
  return processed;
}

// 質問をカテゴリに分類する関数
function categorizeQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('仕事') || lowerQuestion.includes('転職') || lowerQuestion.includes('キャリア')) {
    return 'work';
  } else if (lowerQuestion.includes('恋愛') || lowerQuestion.includes('彼氏') || lowerQuestion.includes('彼女')) {
    return 'love';
  } else if (lowerQuestion.includes('勉強') || lowerQuestion.includes('学校') || lowerQuestion.includes('試験')) {
    return 'study';
  } else if (lowerQuestion.includes('旅行') || lowerQuestion.includes('旅')) {
    return 'travel';
  } else if (lowerQuestion.includes('健康') || lowerQuestion.includes('病気')) {
    return 'health';
  }
  
  return 'other';
}

// キャッシュキーを生成する関数
function generateCacheKey(question: string): string {
  const processedQuestion = preprocessQuestion(question);
  const category = categorizeQuestion(processedQuestion);
  
  // カテゴリ + 元の質問の組み合わせでユニークなキーを作成
  return `${category}:${processedQuestion}`;
}

// キャッシュをクリーンアップする関数（古いエントリを削除）
function cleanupCache() {
  const now = Date.now();
  
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

export async function POST(request: Request) {
  try {
    // リクエストボディから質問を取得
    const { question } = await request.json();

    if (!question || question.trim() === '') {
      return NextResponse.json(
        { error: '質問を入力してください' },
        { status: 400 }
      );
    }

    // 質問の標準化とキャッシュキー生成
    const processedQuestion = preprocessQuestion(question);
    const cacheKey = generateCacheKey(question);
    
    // キャッシュを定期的にクリーンアップ
    cleanupCache();
    
    // キャッシュにあればそれを返す
    if (cache.has(cacheKey)) {
      console.log('キャッシュヒット:', cacheKey);
      const cachedEntry = cache.get(cacheKey) as CacheEntry;
      return NextResponse.json(cachedEntry.data);
    }

    // Anthropic APIキーの取得
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';

    if (!apiKey) {
      console.error('APIキーが設定されていません');
      return NextResponse.json(
        { error: 'APIの設定エラーが発生しました' },
        { status: 500 }
      );
    }

    // Anthropicクライアントの初期化
    const anthropic = new Anthropic({
      apiKey,
    });

    // おみくじプロンプトの作成
    const prompt = `
    あなたは伝統的な日本のおみくじを現代風にアレンジするAIです。
    ユーザーの質問や悩み事に対して、日本の伝統的なおみくじ形式（大吉、中吉、小吉、末吉、凶）で回答してください。
    
    質問: ${processedQuestion}
    
    以下のJSON形式で回答してください:
    {
      "level": "運勢レベル（大吉、中吉、小吉、末吉、凶のいずれか）",
      "advice": "質問に対するアドバイスにもならない変なことクスッと笑えるようなユーモアが効いていておバカな回答をしてください（70文字以内）",
      "message": "神社で引くおみくじによく書かれているような教え（例：願望　思わぬ助けあり叶う, 旅行　焦らず進めば吉,待人　来る待たれよ,仕事　迷わず励めば成就す（30文字以内）"
    }
    
    運勢レベルは質問内容に合わせて適切に選択してください。回答はJSON形式のみで返してください。
    `;

    // Anthropic APIの呼び出し
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        { role: 'user', content: prompt }
      ],
      system: "あなたは伝統的な日本のおみくじです。回答はJSON形式で提供し、運勢（大吉、中吉、小吉、末吉、凶）と、簡潔で変なクスッと笑える回答と、神社風の短い言葉を含めてください。"
    });

    // レスポンスからJSONデータを抽出
    let result;


    try {
      const content = response.content[0].text;
      // JSON部分を抽出（余分なテキストがある場合に備えて）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSONデータが見つかりませんでした');
      }
    } catch (error) {
      console.error('JSONパースエラー:', error);
      return NextResponse.json(
        { error: 'おみくじの結果を解析できませんでした' },
        { status: 500 }
      );
    }

    // 運勢レベルに対応する色を設定
    const fortuneLevel = fortuneLevels.find(f => f.level === result.level);
    if (fortuneLevel) {
      result.color = fortuneLevel.color;
    } else {
      // デフォルトの色（大吉の色）
      result.color = '#E53E3E';
    }

    // キャッシュに結果を保存
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('おみくじAPIエラー:', error);
    return NextResponse.json(
      { error: 'おみくじを引く際にエラーが発生しました' },
      { status: 500 }
    );
  }
}
