import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ModelConfigProps {
  config: {
    modelType: string;
    learningRate: number;
    epochs: number;
    batchSize: number;
    hiddenLayers: number;
  };
  onChange: (config: ModelConfigProps['config']) => void;
}

export const ModelConfig = ({ config, onChange }: ModelConfigProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Model Configuration</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="model-type">Model Type</Label>
          <Select 
            value={config.modelType} 
            onValueChange={(value) => onChange({ ...config, modelType: value })}
          >
            <SelectTrigger id="model-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classification">Classification</SelectItem>
              <SelectItem value="regression">Regression</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="learning-rate">Learning Rate</Label>
            <span className="text-sm text-muted-foreground">{config.learningRate}</span>
          </div>
          <Slider
            id="learning-rate"
            min={0.0001}
            max={0.1}
            step={0.0001}
            value={[config.learningRate]}
            onValueChange={([value]) => onChange({ ...config, learningRate: value })}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="epochs">Epochs</Label>
          <Input
            id="epochs"
            type="number"
            min={1}
            max={1000}
            value={config.epochs}
            onChange={(e) => onChange({ ...config, epochs: parseInt(e.target.value) || 10 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch-size">Batch Size</Label>
          <Input
            id="batch-size"
            type="number"
            min={1}
            max={512}
            value={config.batchSize}
            onChange={(e) => onChange({ ...config, batchSize: parseInt(e.target.value) || 32 })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="hidden-layers">Hidden Layers</Label>
            <span className="text-sm text-muted-foreground">{config.hiddenLayers}</span>
          </div>
          <Slider
            id="hidden-layers"
            min={1}
            max={5}
            step={1}
            value={[config.hiddenLayers]}
            onValueChange={([value]) => onChange({ ...config, hiddenLayers: value })}
            className="py-4"
          />
        </div>
      </div>
    </Card>
  );
};
