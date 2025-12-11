"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import only the icons that are actually used
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { LLMProvider } from "@/lib/providers/config"

interface Provider {
  id: LLMProvider
  name: string
  description: string
  isLocal: boolean
}

interface ProviderSelectorProps {
  selectedProvider: string
  setSelectedProvider: (value: string) => void
  onProviderChange: () => void
}

export function ProviderSelector({
  selectedProvider,
  setSelectedProvider,
  onProviderChange
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true)
      try {
        // Get the providers
        const response = await fetch('/api/get-models', {
          method: 'POST',
        })
        if (!response.ok) {
          throw new Error('Error fetching providers')
        }
        const data = await response.json()
        setProviders(data)

        // If no provider is selected, get the default provider
        if (!selectedProvider && data.length > 0) {
          try {
            // Get the default provider from the API
            const defaultResponse = await fetch('/api/get-default-provider')
            if (defaultResponse.ok) {
              const { defaultProvider } = await defaultResponse.json()

              // Check if the default provider is in the list of available providers
              const providerExists = data.some(p => p.id === defaultProvider)

              if (providerExists) {
                setSelectedProvider(defaultProvider)
              } else {
                // Fallback to the first provider if the default provider is not available
                setSelectedProvider(data[0].id)
              }
            } else {
              // Fallback to the first provider on error
              setSelectedProvider(data[0].id)
            }
          } catch (error) {
            console.error('Error fetching default provider:', error)
            // Fallback to the first provider on error
            setSelectedProvider(data[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching providers:', error)
        toast.error('Providers could not be loaded.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [selectedProvider, setSelectedProvider])

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
    onProviderChange()
  }

  return (
    <Select value={selectedProvider} onValueChange={handleProviderChange}>
      <SelectTrigger className="w-full bg-[#060A0F] border border-[#0D2B38] p-4
                                 focus:border-cyan-400/40 outline-none text-neutral-200
                                 hover:border-cyan-400/20 transition-all duration-200">
        <SelectValue placeholder="Оберіть постачальника..." />
      </SelectTrigger>
      <SelectContent className="bg-[#060A0F] border border-[#0D2B38] text-neutral-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Завантаження постачальників...</span>
          </div>
        ) : providers.length > 0 ? (
          providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id} 
                      className="hover:bg-[#0D2B38] transition-colors duration-150 cursor-pointer">
              <div className="flex flex-col">
                <span className="font-medium">{provider.name}</span>
                <span className="text-xs text-neutral-400">{provider.description}</span>
                {provider.examples && provider.examples.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {provider.examples.map((example, index) => (
                      <span key={index} className="inline-flex items-center rounded-full bg-cyan-400/10 
                                                  border border-cyan-400/20 px-2 py-0.5 text-xs text-cyan-300
                                                  transition-all duration-200 hover:bg-cyan-400/20">
                        {example}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="p-2 text-sm text-neutral-400">
            Постачальники недоступні
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
