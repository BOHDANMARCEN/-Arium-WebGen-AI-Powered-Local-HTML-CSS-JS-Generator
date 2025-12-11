"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Zap } from "lucide-react"
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
  const [isReady, setIsReady] = useState(false)
  const [logoHover, setLogoHover] = useState(false)

  useEffect(() => {
    // Animate elements on mount
    setIsReady(true)
  }, [])

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

  const canGenerate = prompt.trim() && selectedModel

  return (
    <div className="min-h-screen w-full bg-[#04070A] text-white px-8 py-14 font-[Inter] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04070A] via-[#060A0F] to-[#04070A] opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,234,255,0.05),transparent_50%)]" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header with improved animations */}
        <div 
          className={`flex flex-col items-center mb-16 select-none transition-all duration-1000 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Logo Container with multiple effects */}
          <div 
            className="relative mb-6 group cursor-pointer"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            {/* Outer glow ring */}
            <div className={`absolute inset-0 w-32 h-32 -top-2 -left-2 
                          bg-cyan-400/30 rounded-full blur-2xl 
                          transition-all duration-500
                          ${logoHover ? 'opacity-100 scale-110' : 'opacity-50 scale-100'}`} />
            
            {/* Middle glow ring */}
            <div className={`absolute inset-0 w-28 h-28 -top-6 -left-6 
                          bg-cyan-500/20 rounded-full blur-xl 
                          transition-all duration-700
                          ${logoHover ? 'opacity-100 scale-125' : 'opacity-60 scale-100'}`} />
            
            {/* Inner pulsing glow */}
            <div className="absolute inset-0 w-28 h-28 -top-6 -left-6 
                          bg-cyan-400/10 rounded-full blur-lg 
                          animate-pulse" />
            
            {/* Logo image */}
            <img
              src={logoError ? '/placeholder-logo.png' : '/logo-arium-core.png'}
              alt="Arium WebGen Logo"
              className={`relative w-28 opacity-90 
                       transition-all duration-500 
                       ${logoHover ? 'opacity-100 scale-110 rotate-3' : 'opacity-90 scale-100 rotate-0'}
                       drop-shadow-[0_0_20px_#00eaff60] 
                       hover:drop-shadow-[0_0_40px_#00eaff80]`}
              onError={() => {
                setLogoError(true)
              }}
            />
            
            {/* Shimmer effect overlay */}
            <div className={`absolute inset-0 w-28 h-28 -top-6 -left-6
                          bg-gradient-to-r from-transparent via-white/10 to-transparent
                          -skew-x-12
                          transition-all duration-1000
                          ${logoHover ? 'translate-x-[200%] opacity-0' : 'translate-x-[-200%] opacity-0'}`} />
          </div>

          {/* Title with enhanced gradient and animation */}
          <div className="relative mb-2">
            <h1 className="text-5xl font-bold tracking-[0.18em] text-center
                         bg-gradient-to-r from-white via-cyan-100 to-white 
                         bg-clip-text text-transparent
                         transition-all duration-500 
                         hover:scale-105 hover:tracking-[0.2em]
                         relative z-10">
              ARIUM WEBGEN
            </h1>
            
            {/* Text shadow glow effect */}
            <h1 
              className="absolute inset-0 text-5xl font-bold tracking-[0.18em] text-center
                       text-cyan-400/20 blur-sm
                       transition-all duration-500
                       hover:blur-md hover:text-cyan-400/30"
              aria-hidden="true"
            >
              ARIUM WEBGEN
            </h1>
            
            {/* Animated underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2
                          w-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent
                          transition-all duration-700
                          group-hover:w-full" />
          </div>

          {/* Subtitle with improved styling */}
          <p className="text-neutral-400 text-lg tracking-wide 
                       transition-all duration-300 
                       hover:text-cyan-300 hover:tracking-wider
                       relative group">
            <span className="relative z-10">
              AI-Powered Local HTML / CSS / JavaScript Generator
            </span>
            
            {/* Decorative dots */}
            <span className="absolute -left-4 top-1/2 transform -translate-y-1/2
                           text-cyan-400/50 text-xs
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ◆
            </span>
            <span className="absolute -right-4 top-1/2 transform -translate-y-1/2
                           text-cyan-400/50 text-xs
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              ◆
            </span>
          </p>
        </div>

        {/* Input Section with slide-up animation */}
        <div 
          className={`space-y-4 mb-12 transition-all duration-700 delay-100 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <label className="text-neutral-300 uppercase tracking-widest text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            ОПИС ПРОЕКТУ
          </label>

          <div className="border border-[#0D2B38] bg-[#060A0F] p-6 h-56 
                          focus-within:border-cyan-400/40 focus-within:shadow-[0_0_20px_#00eaff20]
                          transition-all duration-300 rounded-lg
                          hover:border-cyan-400/20 group relative overflow-hidden">
            {/* Animated background gradient on focus */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent 
                          opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full bg-transparent outline-none resize-none 
                         text-lg text-neutral-200 leading-relaxed placeholder:text-neutral-500
                         border-0 focus-visible:ring-0 focus-visible:ring-offset-0 relative z-10
                         transition-all duration-200"
              placeholder="Опишіть майбутній веб-сайт, стиль, структуру та функціональність..."
            />
            
            {/* Character counter */}
            {prompt.length > 0 && (
              <div className="absolute bottom-2 right-4 text-xs text-neutral-500 z-10">
                {prompt.length} символів
              </div>
            )}
          </div>
        </div>

        {/* PARAMS PANEL with staggered animation */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 transition-all duration-700 delay-200 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Provider */}
          <div className="space-y-2 group">
            <label className="text-neutral-300 uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              ПОСТАЧАЛЬНИК
            </label>
            <div className="mt-2 transition-transform duration-200 hover:scale-[1.02]">
              <ProviderSelector
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                onProviderChange={() => {}}
              />
            </div>
          </div>

          {/* Model */}
          <div className="space-y-2 group">
            <label className="text-neutral-300 uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              МОДЕЛЬ
            </label>
            <Select 
              value={selectedModel} 
              onValueChange={setSelectedModel} 
              disabled={!selectedProvider || isLoadingModels}
            >
              <SelectTrigger className="w-full mt-2 bg-[#060A0F] border border-[#0D2B38] p-4
                                       focus:border-cyan-400/40 outline-none text-neutral-200
                                       hover:border-cyan-400/20 transition-all duration-200
                                       disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder={selectedProvider ? "Оберіть модель..." : "Спочатку виберіть постачальника"} />
              </SelectTrigger>
              <SelectContent className="bg-[#060A0F] border border-[#0D2B38] text-neutral-200">
                {isLoadingModels ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-cyan-400" />
                    <span>Завантаження моделей...</span>
                  </div>
                ) : models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.id} value={model.id} 
                              className="hover:bg-[#0D2B38] transition-colors duration-150 cursor-pointer">
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

          {/* System Prompt */}
          <div className="md:col-span-2 space-y-2 group">
            <label className="text-neutral-300 uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              СИСТЕМНА ПІДКАЗКА
            </label>
            <Select value={selectedSystemPrompt} onValueChange={setSelectedSystemPrompt}>
              <SelectTrigger className="w-full mt-2 bg-[#060A0F] border border-[#0D2B38] p-4
                                       focus:border-cyan-400/40 outline-none text-neutral-200
                                       hover:border-cyan-400/20 transition-all duration-200">
                <SelectValue placeholder="Оберіть системну підказку..." />
              </SelectTrigger>
              <SelectContent className="bg-[#060A0F] border border-[#0D2B38] text-neutral-200">
                <SelectItem value="default" className="hover:bg-[#0D2B38] transition-colors duration-150 cursor-pointer">
                  <div className="flex flex-col">
                    <span>Стандартна веб-генерація</span>
                    <span className="text-xs text-neutral-400">Стандартна генерація коду</span>
                  </div>
                </SelectItem>
                <SelectItem value="thinking" className="hover:bg-[#0D2B38] transition-colors duration-150 cursor-pointer">
                  <div className="flex flex-col">
                    <span>Креативний режим</span>
                    <span className="text-xs text-neutral-400">З процесом міркування</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom" className="hover:bg-[#0D2B38] transition-colors duration-150 cursor-pointer">
                  <div className="flex flex-col">
                    <span>Строгий HTML/CSS</span>
                    <span className="text-xs text-neutral-400">Власна системна підказка</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom System Prompt with slide animation */}
          {selectedSystemPrompt === 'custom' && (
            <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-neutral-300 uppercase tracking-widest text-sm">
                КАСТОМНА СИСТЕМНА ПІДКАЗКА
              </label>
              <div className="mt-2 border border-[#0D2B38] bg-[#060A0F] p-4
                              focus-within:border-cyan-400/40 focus-within:shadow-[0_0_20px_#00eaff20]
                              transition-all duration-300 rounded-lg">
                <Textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder="Введіть кастомну системну підказку..."
                  className="w-full min-h-[100px] bg-transparent outline-none resize-none 
                             text-neutral-200 placeholder:text-neutral-500
                             border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          )}

          {/* Tokens */}
          <div className="md:col-span-2 space-y-2 group">
            <label className="text-neutral-300 uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              МАКСИМУМ ТОКЕНІВ
            </label>
            <Input
              type="number"
              value={maxTokens || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                setMaxTokens(value && !isNaN(value) && value > 0 ? value : undefined);
              }}
              placeholder="2048"
              className="w-full mt-2 bg-[#060A0F] border border-[#0D2B38] p-4 
                         outline-none focus:border-cyan-400/40 text-neutral-200
                         placeholder:text-neutral-500 transition-all duration-200
                         hover:border-cyan-400/20"
              min="100"
              step="100"
            />
          </div>

        </div>

        {/* BUTTON with enhanced animations */}
        <div 
          className={`flex justify-center transition-all duration-700 delay-300 ${
            isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            onClick={onGenerate}
            disabled={!canGenerate}
            className={`px-14 py-4 bg-[#09131C] border border-cyan-400/30 
                       hover:bg-[#0D1C26] hover:border-cyan-400/60
                       disabled:bg-[#09131C] disabled:border-cyan-400/10 disabled:cursor-not-allowed
                       transition-all duration-300 font-semibold text-lg tracking-wide text-white
                       shadow-[0_0_20px_#00eaff20] hover:shadow-[0_0_30px_#00eaff40]
                       relative overflow-hidden group
                       ${canGenerate ? 'hover:scale-105 active:scale-95' : ''}`}
          >
            {/* Animated background gradient */}
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Glow effect when ready */}
            {canGenerate && (
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 -z-10" />
            )}
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              {canGenerate ? (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>ЗГЕНЕРУВАТИ</span>
                </>
              ) : (
                <span>ЗГЕНЕРУВАТИ</span>
              )}
            </span>
          </Button>
        </div>

      </div>
    </div>
  )
}
