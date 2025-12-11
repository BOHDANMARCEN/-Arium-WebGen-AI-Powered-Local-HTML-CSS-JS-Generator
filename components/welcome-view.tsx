"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Import only the icons that are actually used
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ProviderSelector } from "@/components/provider-selector"

interface Model {
  id: string
  name: string
}

interface WelcomeViewProps {
  prompt: string
  setPrompt: (value: string) => void
  selectedModel: string
  setSelectedModel: (value: string) => void
  selectedProvider: string
  setSelectedProvider: (value: string) => void
  selectedSystemPrompt: string
  setSelectedSystemPrompt: (value: string) => void
  customSystemPrompt: string
  setCustomSystemPrompt: (value: string) => void
  maxTokens: number | undefined
  setMaxTokens: (value: number | undefined) => void
  onGenerate: () => void
}

export function WelcomeView({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  selectedProvider,
  setSelectedProvider,
  selectedSystemPrompt,
  setSelectedSystemPrompt,
  customSystemPrompt,
  setCustomSystemPrompt,
  maxTokens,
  setMaxTokens,
  onGenerate
}: WelcomeViewProps) {
  const [models, setModels] = useState<Model[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    // Load available models when the component mounts or when the provider changes
    const fetchModels = async () => {
      if (!selectedProvider) return;

      setIsLoadingModels(true)
      setSelectedModel("") // Reset the selected model when the provider changes
      setModels([]) // Clear previous models when changing provider

      try {
        const response = await fetch(`/api/get-models?provider=${selectedProvider}`)

        // Parse the JSON response first to get any error message
        const data = await response.json()

        if (!response.ok) {
          // If the response contains an error message, use it
          if (data && data.error) {
            throw new Error(data.error)
          } else {
            throw new Error('Error fetching models')
          }
        }

        setModels(data)

        // Automatically select the first model if available
        if (data.length > 0) {
          setSelectedModel(data[0].id)
        }
      } catch (error) {
        console.error('Error fetching models:', error)

        // Ensure models are cleared when there's an error
        setModels([])
        setSelectedModel("")

        // Display specific error messages based on the provider and error message
        if (error instanceof Error) {
          const errorMessage = error.message

          if (errorMessage.includes('Ollama')) {
            toast.error('Cannot connect to Ollama. Is the server running?')
          } else if (errorMessage.includes('LM Studio')) {
            toast.error('Cannot connect to LM Studio. Is the server running?')
          } else if (selectedProvider === 'deepseek' || selectedProvider === 'openai_compatible') {
            toast.error('Make sure the Base URL and API Keys are correct in your .env.local file.')
          } else {
            toast.error('Models could not be loaded. Please try again later.')
          }
        } else {
          toast.error('Models could not be loaded. Please try again later.')
        }
      } finally {
        setIsLoadingModels(false)
      }
    }

    fetchModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#04070a] to-[#0a1b2d] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Лого */}
        <div className="flex flex-col items-center gap-3">
          <img 
            src={logoError ? '/placeholder-logo.png' : '/logo-webgen.png'} 
            alt="Arium WebGen Logo"
            className="w-24 opacity-90 drop-shadow-[0_0_20px_#00eaff]"
            onError={() => {
              // Fallback to placeholder if logo doesn't exist
              setLogoError(true)
            }}
          />
          <h1 className="text-4xl md:text-5xl font-bold tracking-[.25em] text-center">
            ARIUM WEBGEN
          </h1>
          <p className="text-neutral-400 text-center -mt-2">
            AI-Powered Local HTML/CSS/JS Generator
          </p>
        </div>

        {/* Опис */}
        <div className="text-center max-w-2xl mx-auto text-lg text-neutral-300 leading-relaxed">
          Опиши, що саме ти хочеш створити — і AI згенерує повноцінну веб-сторінку.
        </div>

        {/* Текстове поле */}
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_#00eaff20]">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опиши дизайн, стиль та функціональність майбутнього сайту..."
            className="w-full h-40 bg-transparent outline-none resize-none text-lg placeholder-neutral-500 text-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Панель параметрів */}
        <div className="grid md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_0_20px_#00eaff10]">
          {/* Постачальник */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Постачальник</label>
            <ProviderSelector
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              onProviderChange={() => {}}
            />
          </div>

          {/* Модель */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Модель</label>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel} 
              disabled={!selectedProvider || isLoadingModels}
            >
              <SelectTrigger className="bg-white/10 border-white/10 text-white hover:bg-white/15 focus:ring-cyan-500">
                <SelectValue placeholder={selectedProvider ? "Оберіть модель..." : "Спочатку виберіть постачальника"} />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1b2d] border-white/10 text-white">
                {isLoadingModels ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Завантаження моделей...</span>
                  </div>
                ) : models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="hover:bg-white/10">
                      <div className="flex flex-col">
                        <span className="truncate max-w-[250px]">{model.name}</span>
                        {model.id !== model.name && (
                          <span className="text-xs text-neutral-500 truncate max-w-[250px]">{model.id}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-neutral-400">
                    {selectedProvider ? "Моделі недоступні" : "Спочатку виберіть постачальника"}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Системні підказки */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-neutral-400">Системні підказки</label>
            <Select value={selectedSystemPrompt} onValueChange={setSelectedSystemPrompt}>
              <SelectTrigger className="bg-white/10 border-white/10 text-white hover:bg-white/15 focus:ring-cyan-500">
                <SelectValue placeholder="Оберіть системну підказку..." />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1b2d] border-white/10 text-white">
                <SelectItem value="default" className="hover:bg-white/10">
                  <div className="flex flex-col">
                    <span>Стандартна генерація</span>
                    <span className="text-xs text-neutral-400">Стандартна генерація коду</span>
                  </div>
                </SelectItem>
                <SelectItem value="thinking" className="hover:bg-white/10">
                  <div className="flex flex-col">
                    <span>Thinking режим</span>
                    <span className="text-xs text-neutral-400">З процесом міркування</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom" className="hover:bg-white/10">
                  <div className="flex flex-col">
                    <span>Кастомна підказка</span>
                    <span className="text-xs text-neutral-400">Власна системна підказка</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Кастомна системна підказка */}
          {selectedSystemPrompt === 'custom' && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-neutral-400">Кастомна системна підказка</label>
              <Textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                placeholder="Введіть кастомну системну підказку..."
                className="min-h-[100px] w-full bg-white/10 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-cyan-500"
              />
            </div>
          )}

          {/* Макс. токени */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-neutral-400">Макс. токени</label>
            <Input
              type="number"
              value={maxTokens || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                setMaxTokens(value && !isNaN(value) && value > 0 ? value : undefined);
              }}
              placeholder="Наприклад: 2048"
              className="bg-white/10 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-cyan-500"
              min="100"
              step="100"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Встановіть максимальну кількість токенів для виводу моделі. Залиште порожнім для використання значення за замовчуванням.
            </p>
          </div>
        </div>

        {/* Кнопка */}
        <div className="flex justify-center">
          <Button
            onClick={onGenerate}
            disabled={!prompt.trim() || !selectedModel}
            className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed transition-all text-black font-bold rounded-xl text-lg shadow-[0_0_20px_#00eaff80] hover:shadow-[0_0_30px_#00eaff]"
          >
            ЗГЕНЕРУВАТИ
          </Button>
        </div>
      </div>
    </div>
  )
}
