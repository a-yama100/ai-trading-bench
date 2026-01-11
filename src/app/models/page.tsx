import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Model {
  id: string
  display_name: string
  provider: string
  backend_type: string
  is_active: boolean
}

async function getshared_models(): Promise<Model[]> {
  const { data, error } = await supabase
    .from('shared_models')
    .select('*')
    .eq('is_active', true)
    .order('provider', { ascending: true })
    .order('display_name', { ascending: true })

  if (error) {
    console.error('Error fetching models:', error)
    return []
  }
  return (data as Model[]) || []
}

async function getModelStats() {
  const { data, error } = await supabase
    .from('tb_benchmark_runs')
    .select('model_id, return_pct, category_id')
    .eq('status', 'completed')

  if (error) {
    console.error('Error fetching model stats:', error)
    return {}
  }

  const stats: Record<string, { avgReturn: number; runCount: number }> = {}
  const modelData: Record<string, number[]> = {}

  for (const run of data || []) {
    if (!modelData[run.model_id]) {
      modelData[run.model_id] = []
    }
    modelData[run.model_id].push(Number(run.return_pct))
  }

  for (const [modelId, returns] of Object.entries(modelData)) {
    const avg = returns.reduce((a, b) => a + b, 0) / returns.length
    stats[modelId] = { avgReturn: avg, runCount: returns.length }
  }

  return stats
}

function getProviderColor(provider: string) {
  switch (provider) {
    case 'openai': return 'bg-green-100 text-green-800'
    case 'anthropic': return 'bg-orange-100 text-orange-800'
    case 'google': return 'bg-blue-100 text-blue-800'
    case 'xai': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getProviderName(provider: string) {
  switch (provider) {
    case 'openai': return 'OpenAI'
    case 'anthropic': return 'Anthropic'
    case 'google': return 'Google'
    case 'xai': return 'xAI'
    default: return provider
  }
}

export default async function ModelsPage() {
  const models = await getshared_models()
  const stats = await getModelStats()

  const groupedModels: Record<string, Model[]> = {}
  for (const model of models) {
    if (!groupedModels[model.provider]) {
      groupedModels[model.provider] = []
    }
    groupedModels[model.provider].push(model)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Models</h1>
        <p className="text-gray-600 mt-2">All AI models participating in the trading benchmark. Click on a model to view detailed performance.</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <div key={provider} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">{getProviderName(provider)}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {providerModels.map((model: Model) => {
                const modelStats = stats[model.id]
                return (
                  <Link
                    key={model.id}
                    href={'/models/' + model.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex items-center gap-4">
                      <span className={getProviderColor(provider) + ' px-3 py-1 rounded-full text-xs font-medium'}>
                        {getProviderName(provider)}
                      </span>
                      <div>
                        <h3 className="font-medium text-gray-900">{model.display_name}</h3>
                        <p className="text-sm text-gray-500">{model.id}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      {modelStats ? (
                        <>
                          <div>
                            <p className={modelStats.avgReturn >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {modelStats.avgReturn >= 0 ? '+' : ''}{modelStats.avgReturn.toFixed(2)}% avg
                            </p>
                            <p className="text-sm text-gray-500">{modelStats.runCount} runs</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400">No data</p>
                      )}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
