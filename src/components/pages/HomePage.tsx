import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { H1, MARKETS, MARKET_IDS, UI, type Lang } from '@/lib/content'
import { localePath } from '@/lib/i18n'

async function getTopModels() {
  const results: Record<string, Array<{ model_id: string; display_name: string; return_pct: number }>> = {}

  // Load the model names first
  const { data: models } = await supabase
    .from('shared_models')
    .select('id, display_name')

  const modelMap = new Map(models?.map(m => [m.id, m.display_name]) || [])

  for (const catId of MARKET_IDS) {
    const { data } = await supabase
      .from('tb_benchmark_runs')
      .select('model_id, return_pct')
      .eq('category_id', catId)
      .eq('status', 'completed')
      .order('return_pct', { ascending: false })
      .limit(3)

    results[catId] = (data || []).map((row) => ({
      model_id: row.model_id,
      display_name: modelMap.get(row.model_id) || row.model_id,
      return_pct: Number(row.return_pct),
    }))
  }

  return results
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">&#x1F451;</span>
  if (rank === 2) return <span className="text-lg text-gray-400">&#x1F948;</span>
  if (rank === 3) return <span className="text-lg text-amber-600">&#x1F949;</span>
  return null
}

export async function HomePage({ lang }: { lang: Lang }) {
  const topModels = await getTopModels()
  const t = UI[lang].home

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{H1[lang].home}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t.lead.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
        <Image
          src="/media/hero.webp"
          alt={t.heroAlt}
          width={1600}
          height={679}
          priority
          sizes="(min-width: 1152px) 1120px, 100vw"
          className="mt-8 w-full h-auto rounded-2xl"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {MARKET_IDS.map((catId) => {
          const cat = MARKETS[catId]
          const href = localePath(lang, '/' + catId)
          return (
            <div key={catId} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Link href={href} className={'bg-gradient-to-r ' + cat.gradient + ' p-6 block hover:opacity-90 transition-opacity'}>
                <h2 className="text-2xl font-bold text-white">{cat[lang].name}</h2>
                <p className="text-white/80">{cat[lang].cardSubtitle}</p>
              </Link>
              <div className="p-6">
                {topModels[catId]?.length > 0 ? (
                  <div className="space-y-3">
                    {topModels[catId].map((model, idx) => (
                      <Link
                        key={model.model_id}
                        href={localePath(lang, '/' + catId + '/' + model.model_id)}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <RankIcon rank={idx + 1} />
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {model.display_name}
                          </span>
                        </div>
                        <span className={model.return_pct >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                          {model.return_pct >= 0 ? '+' : ''}{model.return_pct.toFixed(1)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">{t.noData}</p>
                )}
                <Link
                  href={href}
                  className="mt-4 block text-center py-2 px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  {t.viewDetails}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
