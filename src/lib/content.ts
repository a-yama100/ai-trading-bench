// 画面に出す文字（日本語と英語）。ページと部品は、ここから lang に合わせて取り出す。
// 英語の文は、日本語版を作る前の文のまま。

export type Lang = 'ja' | 'en'
export type MarketId = 'crypto' | 'forex' | 'stock'

export const SITE_URL = 'https://trading.phaiworks.com'

export const SITE_NAME: Record<Lang, string> = {
  ja: 'AIトレーディング・ベンチマーク',
  en: 'AI Trading Benchmark',
}

// 各ページの h1（日本語は仮の案。あとで差し替える前提で、ここ1か所にまとめる）
export const H1: Record<Lang, Record<'home' | 'models' | 'faq' | 'privacy' | 'terms' | MarketId, string>> = {
  ja: {
    home: 'AIモデルの模擬売買の成績比較',
    crypto: '暗号資産の模擬売買ランキング',
    forex: '為替の模擬売買ランキング',
    stock: '株価指数の模擬売買ランキング',
    models: 'ベンチマーク対象のAIモデル一覧',
    faq: 'よくある質問',
    privacy: 'プライバシーポリシー',
    terms: '利用規約',
  },
  en: {
    home: 'AI Trading Benchmark',
    crypto: 'Cryptocurrency',
    forex: 'Forex',
    stock: 'Stock',
    models: 'AI Models',
    faq: 'Frequently Asked Questions',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
}

// 市場ごとの表示
export const MARKETS: Record<MarketId, {
  gradient: string
  color: string
  ja: MarketText
  en: MarketText
}> = {
  crypto: {
    gradient: 'from-orange-400 to-orange-600',
    color: '#f97316',
    ja: {
      name: '暗号資産',
      cardSubtitle: 'BTC/USD',
      subtitle: 'BTC/USD（ビットコイン/米ドル）',
      label: '暗号資産（BTC/USD）',
      back: '暗号資産のランキングに戻る',
      allRuns: '暗号資産の成績一覧',
      noRuns: 'このモデルの暗号資産の成績はまだありません',
    },
    en: {
      name: 'Cryptocurrency',
      cardSubtitle: 'BTC/USD',
      subtitle: 'BTC/USD Trading Benchmark',
      label: 'Cryptocurrency (BTC/USD)',
      back: 'Back to Crypto Leaderboard',
      allRuns: 'All Crypto Runs',
      noRuns: 'No benchmark runs for this model in Crypto',
    },
  },
  forex: {
    gradient: 'from-blue-400 to-blue-600',
    color: '#3b82f6',
    ja: {
      name: '為替',
      cardSubtitle: 'EUR/USD',
      subtitle: 'EUR/USD（ユーロ/米ドル）',
      label: '為替（EUR/USD）',
      back: '為替のランキングに戻る',
      allRuns: '為替の成績一覧',
      noRuns: 'このモデルの為替の成績はまだありません',
    },
    en: {
      name: 'Forex',
      cardSubtitle: 'EUR/USD',
      subtitle: 'EUR/USD Trading Benchmark',
      label: 'Forex (EUR/USD)',
      back: 'Back to Forex Leaderboard',
      allRuns: 'All Forex Runs',
      noRuns: 'No benchmark runs for this model in Forex',
    },
  },
  stock: {
    gradient: 'from-green-400 to-green-600',
    color: '#22c55e',
    ja: {
      name: '株価指数',
      cardSubtitle: 'S&P 500',
      subtitle: 'S&P 500（米国の代表的な株価指数）',
      label: '株価指数（S&P 500）',
      back: '株価指数のランキングに戻る',
      allRuns: '株価指数の成績一覧',
      noRuns: 'このモデルの株価指数の成績はまだありません',
    },
    en: {
      name: 'Stock',
      cardSubtitle: 'S&P 500',
      subtitle: 'S&P 500 Trading Benchmark',
      label: 'Stock (S&P 500)',
      back: 'Back to Stock Leaderboard',
      allRuns: 'All Stock Runs',
      noRuns: 'No benchmark runs for this model in Stock',
    },
  },
}

export interface MarketText {
  name: string
  cardSubtitle: string
  subtitle: string
  label: string
  back: string
  allRuns: string
  noRuns: string
}

export const MARKET_IDS: MarketId[] = ['crypto', 'forex', 'stock']

// 市場の名前（モデルの詳しいページの表とグラフ）
export const CATEGORY_NAMES: Record<Lang, Record<string, string>> = {
  ja: { crypto: '暗号資産', forex: '為替', stock: '株価指数' },
  en: { crypto: 'Cryptocurrency', forex: 'Forex', stock: 'Stock' },
}

export const PROVIDER_NAMES: Record<Lang, Record<string, string>> = {
  ja: { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', xai: 'xAI', ollama: 'ローカル（Ollama）' },
  en: { openai: 'OpenAI', anthropic: 'Anthropic', google: 'Google', xai: 'xAI', ollama: 'Ollama (local)' },
}

// 日付の書き方（英語は以前と同じく、閲覧環境の既定）
export function dateLocale(lang: Lang): string | undefined {
  return lang === 'ja' ? 'ja-JP' : undefined
}

export const UI = {
  ja: {
    nav: { home: 'ホーム', crypto: '暗号資産', forex: '為替', stock: '株価指数', models: 'AIモデル', faq: 'よくある質問', menu: 'メニューを開く' },
    langSwitch: { ja: '日本語', en: 'English' },
    footer: {
      description: '暗号資産・為替・株価指数の3つの市場で、AIモデルの模擬売買の成績を比べています。',
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
    },
    scrollTop: 'ページの先頭へ戻る',
    home: {
      lead: [
        '同じ期間の実際の値動きをもとに、AIモデルごとの売買判断と収益率を比べています。',
        '各AIモデルは $10,000 の仮想資金を元手に、ビットコイン、ユーロ/米ドル、S&P 500 の模擬売買を、それぞれ約30取引日行います。',
      ],
      heroAlt: 'AIモデルによる暗号資産・為替・株価指数の模擬売買を表したイメージ',
      noData: 'まだデータがありません',
      viewDetails: '詳しく見る',
    },
    market: {
      totalRuns: '測定回数',
      avgReturn: '平均収益率',
      bestReturn: '最高収益率',
      worstReturn: '最低収益率',
      leaderboard: 'ランキング',
      leaderboardHint: 'モデル名を選ぶと、詳しい成績を表示します。',
      rank: '順位',
      model: 'モデル',
      return: '収益率',
      winRate: '利益確定取引率',
      trades: '取引回数',
      finalBalance: '最終資産額',
      unknown: '不明',
      noData: '測定結果はまだありません',
    },
    marketModel: {
      avgReturn: '平均収益率',
      totalRuns: '測定回数',
      avgTrades: '平均取引回数',
      winRate: '利益確定取引率',
      best: '最高収益率',
      worst: '最低収益率',
      tradesFinal: (trades: number, final: string) => `取引 ${trades} 回 | 最終資産額 ${final}`,
      charts: '成績の推移',
      date: '日付',
      return: '収益率',
      trades: '取引回数',
      wins: '利益確定回数',
      initial: '元手',
      final: '最終資産額',
      allMarkets: (name: string) => `${name} の全市場での成績を見る →`,
    },
    models: {
      lead: 'このベンチマークで比べているAIモデルの一覧です。モデルを選ぶと、成績を表示します。',
      avg: (v: string) => `平均収益率 ${v}%`,
      runs: (n: number) => `測定 ${n} 回`,
      noData: 'データなし',
    },
    modelDetail: {
      overallReturn: '全市場の平均収益率',
      totalRuns: '測定回数',
      provider: '提供元',
      type: '種類',
      byMarket: '市場別の成績',
      marketStats: '市場別の成績集計',
      market: '市場',
      avgReturn: '平均収益率',
      avgTrades: '平均取引回数',
      winRate: '利益確定取引率',
      noData: '測定結果はありません',
      recentRuns: '最近の測定結果',
      return: '収益率',
      trades: '取引回数',
      finalBalance: '最終資産額',
      date: '日付',
      noRuns: 'このモデルの測定結果はまだありません',
    },
    tradeChart: {
      noData: '測定結果はありません',
      portfolioTitle: '総資産額の推移',
      dayAxis: '日数',
      dayLabel: (d: string | number) => `${d}日目`,
      portfolio: '総資産額',
      buy: '買い',
      sell: '売り',
      initialBalance: '元手',
      pnlTitle: '累積収益率（%）',
      pnl: '累積収益率',
      noDaily: 'この測定結果には、日別の売買データがありません。',
      noDailyHint: '詳しいグラフは、日別の売買データを保存した測定結果でのみ表示できます。',
      historyTitle: '測定履歴',
      runAxis: '測定回',
      runLabel: (r: string | number) => `${r}回目`,
      return: '収益率',
    },
    modelChart: {
      noData: 'このモデルの測定結果はありません。',
      return: '収益率',
    },
    updated: '最終更新日: 2026年11月',
  },
  en: {
    nav: { home: 'Home', crypto: 'Crypto', forex: 'Forex', stock: 'Stock', models: 'Models', faq: 'FAQ', menu: 'Open menu' },
    langSwitch: { ja: '日本語', en: 'English' },
    footer: {
      description: 'Comparing AI models in trading decisions across cryptocurrency, forex, and stock markets.',
      terms: 'Terms',
      privacy: 'Privacy',
    },
    scrollTop: 'Scroll to top',
    home: {
      lead: [
        'See how AI models trade when they get the same market data. Each model trades Bitcoin, the euro against the dollar, and the S&P 500 for up to 30 trading days, starting with a virtual $10,000.',
      ],
      heroAlt: 'AI models competing in a simulated trading challenge across crypto, forex and stock markets',
      noData: 'No data yet',
      viewDetails: 'View Details',
    },
    market: {
      totalRuns: 'Total Runs',
      avgReturn: 'Avg Return',
      bestReturn: 'Best Return',
      worstReturn: 'Worst Return',
      leaderboard: 'Leaderboard',
      leaderboardHint: 'Click on a model to view detailed performance',
      rank: 'Rank',
      model: 'Model',
      return: 'Return',
      winRate: 'Win Rate',
      trades: 'Trades',
      finalBalance: 'Final Balance',
      unknown: 'unknown',
      noData: 'No benchmark data available yet',
    },
    marketModel: {
      avgReturn: 'Avg Return',
      totalRuns: 'Total Runs',
      avgTrades: 'Avg Trades',
      winRate: 'Win Rate',
      best: 'Best Performance',
      worst: 'Worst Performance',
      tradesFinal: (trades: number, final: string) => `${trades} trades | Final: ${final}`,
      charts: 'Performance Charts',
      date: 'Date',
      return: 'Return',
      trades: 'Trades',
      wins: 'Wins',
      initial: 'Initial',
      final: 'Final',
      allMarkets: (name: string) => `View all market performance for ${name} →`,
    },
    models: {
      lead: 'Every AI model in the trading benchmark. Click a model to see its results.',
      avg: (v: string) => `${v}% avg`,
      runs: (n: number) => `${n} runs`,
      noData: 'No data',
    },
    modelDetail: {
      overallReturn: 'Overall Return',
      totalRuns: 'Total Runs',
      provider: 'Provider',
      type: 'Type',
      byMarket: 'Performance by Market',
      marketStats: 'Market Statistics',
      market: 'Market',
      avgReturn: 'Avg Return',
      avgTrades: 'Avg Trades',
      winRate: 'Win Rate',
      noData: 'No benchmark data available',
      recentRuns: 'Recent Runs',
      return: 'Return',
      trades: 'Trades',
      finalBalance: 'Final Balance',
      date: 'Date',
      noRuns: 'No runs yet for this model',
    },
    tradeChart: {
      noData: 'No benchmark data available',
      portfolioTitle: 'Portfolio Value Over Time',
      dayAxis: 'Day',
      dayLabel: (d: string | number) => `Day ${d}`,
      portfolio: 'Portfolio',
      buy: 'Buy',
      sell: 'Sell',
      initialBalance: 'Initial Balance',
      pnlTitle: 'Cumulative P&L (%)',
      pnl: 'P&L',
      noDaily: 'Daily trading data not available for this run.',
      noDailyHint: 'Run a new benchmark with --save to see detailed charts.',
      historyTitle: 'Run History',
      runAxis: 'Run #',
      runLabel: (r: string | number) => `Run #${r}`,
      return: 'Return',
    },
    modelChart: {
      noData: 'No benchmark data available for this model.',
      return: 'Return',
    },
    updated: 'Last updated: November 2026',
  },
}

// ページの題名と説明（検索結果・SNS 用）
export const META: Record<Lang, {
  defaultTitle: string
  description: string
  twitterDescription: string
  pages: Record<'crypto' | 'forex' | 'stock' | 'models' | 'faq' | 'privacy' | 'terms', { title: string; description: string }>
  modelDetail: (name: string) => { title: string; description: string }
  marketModel: (market: string, name: string) => { title: string; description: string }
  ogAlt: string
}> = {
  ja: {
    defaultTitle: 'AIトレーディング・ベンチマーク｜AIモデルの模擬売買の成績を比較',
    description: 'GPT、Claude、Gemini、Grok などのAIモデルが、ビットコイン、ユーロ/米ドル、S&P 500 を模擬売買した成績を比べています。$10,000 の仮想資金を元手に、約30取引日の収益率を測定します。',
    twitterDescription: 'GPT、Claude、Gemini、Grok などのAIモデルの売買成績を、約30取引日の模擬売買で比べています。',
    pages: {
      crypto: { title: '暗号資産（BTC/USD）の模擬売買ランキング', description: 'ビットコイン/米ドル（BTC/USD）の模擬売買での、AIモデル別の収益率ランキングです。利益確定取引率と取引回数も比べられます。' },
      forex: { title: '為替（EUR/USD）の模擬売買ランキング', description: 'ユーロ/米ドル（EUR/USD）の模擬売買での、AIモデル別の収益率ランキングです。利益確定取引率と取引回数も比べられます。' },
      stock: { title: '株価指数（S&P 500）の模擬売買ランキング', description: 'S&P 500の模擬売買での、AIモデル別の収益率ランキングです。利益確定取引率と取引回数も比べられます。' },
      models: { title: 'AIモデル一覧', description: '比較対象のAIモデルの一覧です。提供元ごとにモデルを分け、各モデルの平均収益率と測定回数を掲載しています。' },
      faq: { title: 'よくある質問', description: 'AIトレーディング・ベンチマークの仕組み、対象のAIモデルと市場、結果の計算方法についてのよくある質問です。' },
      privacy: { title: 'プライバシーポリシー', description: 'AIトレーディング・ベンチマークでの情報の取り扱いについて説明します。' },
      terms: { title: '利用規約', description: 'AIトレーディング・ベンチマークの利用規約です。' },
    },
    modelDetail: (name) => ({ title: `${name} の模擬売買の成績`, description: `${name} による暗号資産・為替・株価指数の模擬売買の成績です。市場別の収益率と最近の測定結果を掲載しています。` }),
    marketModel: (market, name) => ({ title: `${name} の${market}の模擬売買の成績`, description: `${name} による${market}の模擬売買の成績です。総資産額の推移、累積収益率、測定ごとの結果を掲載しています。` }),
    ogAlt: 'AIトレーディング・ベンチマーク',
  },
  en: {
    defaultTitle: 'AI Trading Benchmark - Compare AI Models in Trading Decisions',
    description: 'Compare how AI models from OpenAI, Anthropic, Google and xAI trade Bitcoin, EUR/USD and the S&P 500 in a 30-day simulation with a virtual $10,000.',
    twitterDescription: 'Compare how AI models from OpenAI, Anthropic, Google and xAI trade in a 30-day simulation.',
    pages: {
      crypto: { title: 'Cryptocurrency (BTC/USD) Leaderboard', description: 'BTC/USD Trading Benchmark: return, win rate and trades for each AI model.' },
      forex: { title: 'Forex (EUR/USD) Leaderboard', description: 'EUR/USD Trading Benchmark: return, win rate and trades for each AI model.' },
      stock: { title: 'Stock (S&P 500) Leaderboard', description: 'S&P 500 Trading Benchmark: return, win rate and trades for each AI model.' },
      models: { title: 'AI Models', description: 'Every AI model in the trading benchmark. Click a model to see its results.' },
      faq: { title: 'FAQ', description: 'Answers to common questions about AI Trading Benchmark: how it works, which AI models and markets are tested, and how the results are calculated.' },
      privacy: { title: 'Privacy Policy', description: 'How AI Trading Benchmark collects, uses, and safeguards your information.' },
      terms: { title: 'Terms of Service', description: 'Terms of Service for AI Trading Benchmark.' },
    },
    modelDetail: (name) => ({ title: `${name} Performance`, description: `Performance of ${name} across cryptocurrency, forex, and stock markets.` }),
    marketModel: (market, name) => ({ title: `${name} - ${market}`, description: `${market} benchmark runs for ${name}.` }),
    ogAlt: 'AI Trading Benchmark',
  },
}
