
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, MessageSquare } from "lucide-react";
import { LLMConfig } from "@/services/llm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface ChatHeaderProps {
  llmConfig: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  clearChat: () => void;
}

export function ChatHeader({ llmConfig, onConfigChange, clearChat }: ChatHeaderProps) {
  const [localConfig, setLocalConfig] = useState<LLMConfig>({...llmConfig});

  const handleSaveConfig = () => {
    onConfigChange(localConfig);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-thoughtful-600" />
        <h2 className="text-lg font-medium">Thoughtful AI Support</h2>
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Model Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure the AI model used for responses.
                </p>
              </div>
              
              <div className="grid gap-2">
                <RadioGroup 
                  value={localConfig.provider}
                  onValueChange={(value) => setLocalConfig({...localConfig, provider: value as LLMConfig['provider']})}
                  className="grid grid-cols-2 gap-2"
                >
                  <div>
                    <RadioGroupItem value="local" id="local" className="peer sr-only" />
                    <Label
                      htmlFor="local"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-thoughtful-600 [&:has([data-state=checked])]:border-thoughtful-600"
                    >
                      <span>Local LLM</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="openai" id="openai" className="peer sr-only" />
                    <Label
                      htmlFor="openai"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-thoughtful-600 [&:has([data-state=checked])]:border-thoughtful-600"
                    >
                      <span>OpenAI</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {localConfig.provider === 'local' && (
                <div className="grid gap-2">
                  <Label htmlFor="localEndpoint">Local Endpoint</Label>
                  <Input 
                    id="localEndpoint" 
                    value={localConfig.localEndpoint || 'http://localhost:11434/api/chat'} 
                    onChange={(e) => setLocalConfig({...localConfig, localEndpoint: e.target.value})}
                  />
                </div>
              )}
              
              {localConfig.provider === 'openai' && (
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <Input 
                    id="apiKey" 
                    value={localConfig.apiKey || ''} 
                    onChange={(e) => setLocalConfig({...localConfig, apiKey: e.target.value})}
                    type="password"
                  />
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearChat}>
                  Clear Chat
                </Button>
                <Button onClick={handleSaveConfig} className="bg-thoughtful-600 hover:bg-thoughtful-700">
                  Save Settings
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
