import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { TrainingChart } from "@/components/TrainingChart";
import { ModelConfig } from "@/components/ModelConfig";
import { DataUpload } from "@/components/DataUpload";
import { Brain, Play, Square, Download, Activity, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState({
    currentEpoch: 0,
    loss: 0,
    accuracy: 0,
    trainingTime: 0,
  });
  const [chartData, setChartData] = useState<Array<{ epoch: number; loss: number; accuracy: number }>>([]);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [config, setConfig] = useState({
    modelType: "classification",
    learningRate: 0.01,
    epochs: 50,
    batchSize: 32,
    hiddenLayers: 2,
  });

  useEffect(() => {
    // Initialize TensorFlow.js
    tf.ready().then(() => {
      console.log("TensorFlow.js ready");
    });
  }, []);

  const buildModel = () => {
    const newModel = tf.sequential();
    
    // Input layer
    newModel.add(tf.layers.dense({ 
      units: 64, 
      activation: 'relu', 
      inputShape: [4] // Assuming 4 features for sample data
    }));

    // Hidden layers
    for (let i = 0; i < config.hiddenLayers; i++) {
      newModel.add(tf.layers.dense({ 
        units: 32, 
        activation: 'relu' 
      }));
    }

    // Output layer
    if (config.modelType === "classification") {
      newModel.add(tf.layers.dense({ 
        units: 3, // 3 classes for Iris dataset
        activation: 'softmax' 
      }));
    } else {
      newModel.add(tf.layers.dense({ 
        units: 1, 
        activation: 'linear' 
      }));
    }

    newModel.compile({
      optimizer: tf.train.adam(config.learningRate),
      loss: config.modelType === "classification" ? 'categoricalCrossentropy' : 'meanSquaredError',
      metrics: ['accuracy'],
    });

    return newModel;
  };

  const prepareData = () => {
    if (trainingData.length === 0) return null;

    // Extract features (first 4 columns) and labels (last column)
    const features = trainingData.map(row => [
      parseFloat(row.sepal_length) || 0,
      parseFloat(row.sepal_width) || 0,
      parseFloat(row.petal_length) || 0,
      parseFloat(row.petal_width) || 0,
    ]);

    const labelMap: { [key: string]: number } = { setosa: 0, versicolor: 1, virginica: 2 };
    const labels = trainingData.map(row => {
      const label = labelMap[row.species] || 0;
      return [label === 0 ? 1 : 0, label === 1 ? 1 : 0, label === 2 ? 1 : 0]; // One-hot encode
    });

    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    return { xs, ys };
  };

  const startTraining = async () => {
    if (trainingData.length === 0) {
      toast.error("Please load data first");
      return;
    }

    setIsTraining(true);
    setChartData([]);
    const startTime = Date.now();

    try {
      const newModel = buildModel();
      const data = prepareData();

      if (!data) {
        toast.error("Failed to prepare data");
        return;
      }

      const history: Array<{ epoch: number; loss: number; accuracy: number }> = [];

      await newModel.fit(data.xs, data.ys, {
        epochs: config.epochs,
        batchSize: config.batchSize,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const loss = logs?.loss || 0;
            const acc = logs?.acc || 0;
            
            setMetrics({
              currentEpoch: epoch + 1,
              loss: parseFloat(loss.toFixed(4)),
              accuracy: parseFloat((acc * 100).toFixed(2)),
              trainingTime: Math.floor((Date.now() - startTime) / 1000),
            });

            history.push({
              epoch: epoch + 1,
              loss: parseFloat(loss.toFixed(4)),
              accuracy: parseFloat((acc * 100).toFixed(2)),
            });

            setChartData([...history]);
          },
        },
      });

      data.xs.dispose();
      data.ys.dispose();

      setModel(newModel);
      toast.success("Training completed successfully!");
    } catch (error) {
      console.error("Training error:", error);
      toast.error("Training failed: " + (error as Error).message);
    } finally {
      setIsTraining(false);
    }
  };

  const stopTraining = () => {
    setIsTraining(false);
    toast.info("Training stopped");
  };

  const downloadModel = async () => {
    if (!model) {
      toast.error("No model to download");
      return;
    }

    try {
      await model.save('downloads://ml-model');
      toast.success("Model downloaded successfully");
    } catch (error) {
      toast.error("Failed to download model");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ML Training Studio
                </h1>
                <p className="text-sm text-muted-foreground">Train neural networks in your browser</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isTraining ? (
                <Button 
                  onClick={startTraining} 
                  disabled={trainingData.length === 0}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Training
                </Button>
              ) : (
                <Button onClick={stopTraining} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  Stop Training
                </Button>
              )}
              
              <Button 
                onClick={downloadModel} 
                variant="outline"
                disabled={!model}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Model
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Current Epoch"
            value={`${metrics.currentEpoch} / ${config.epochs}`}
            subtitle={isTraining ? "Training..." : "Ready"}
            icon={<Activity className="w-5 h-5 text-primary" />}
            variant="primary"
          />
          <MetricCard
            title="Loss"
            value={metrics.loss.toFixed(4)}
            subtitle={chartData.length > 1 ? `${((chartData[chartData.length - 2].loss - metrics.loss) / chartData[chartData.length - 2].loss * 100).toFixed(1)}% change` : "No data"}
            trend={chartData.length > 1 && metrics.loss < chartData[chartData.length - 2].loss ? "down" : "neutral"}
            icon={<TrendingUp className="w-5 h-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Accuracy"
            value={`${metrics.accuracy}%`}
            subtitle={chartData.length > 0 ? "Validation set" : "No data"}
            icon={<Zap className="w-5 h-5 text-success" />}
            variant="success"
          />
          <MetricCard
            title="Training Time"
            value={`${metrics.trainingTime}s`}
            subtitle={isTraining ? "Running..." : "Idle"}
            icon={<Brain className="w-5 h-5 text-muted-foreground" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <DataUpload onDataLoad={setTrainingData} />
            <ModelConfig config={config} onChange={setConfig} />
          </div>

          {/* Right Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <TrainingChart 
              data={chartData} 
              title="Training Progress"
            />
            
            {chartData.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Training Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Best Loss</p>
                    <p className="text-2xl font-bold text-primary">
                      {Math.min(...chartData.map(d => d.loss)).toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Accuracy</p>
                    <p className="text-2xl font-bold text-success">
                      {Math.max(...chartData.map(d => d.accuracy)).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Epochs</p>
                    <p className="text-2xl font-bold">{chartData.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dataset Size</p>
                    <p className="text-2xl font-bold">{trainingData.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
