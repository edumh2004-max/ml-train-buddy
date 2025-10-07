import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

interface DataUploadProps {
  onDataLoad: (data: any[]) => void;
}

export const DataUpload = ({ onDataLoad }: DataUploadProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [rowCount, setRowCount] = useState<number>(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          onDataLoad(results.data);
          setRowCount(results.data.length);
          toast.success(`Loaded ${results.data.length} rows from ${file.name}`);
        }
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const loadSampleData = () => {
    // Generate sample data for classification (Iris-like dataset)
    const sampleData = Array.from({ length: 150 }, (_, i) => ({
      sepal_length: (Math.random() * 3 + 4).toFixed(2),
      sepal_width: (Math.random() * 2 + 2).toFixed(2),
      petal_length: (Math.random() * 5 + 1).toFixed(2),
      petal_width: (Math.random() * 2 + 0.1).toFixed(2),
      species: ['setosa', 'versicolor', 'virginica'][Math.floor(i / 50)],
    }));

    onDataLoad(sampleData);
    setFileName("sample_iris_data.csv");
    setRowCount(150);
    toast.success("Loaded sample Iris dataset (150 rows)");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Data Source</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload your CSV file or use sample data
          </p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
            
            <Button variant="secondary" onClick={loadSampleData}>
              <FileText className="w-4 h-4 mr-2" />
              Use Sample Data
            </Button>
          </div>
        </div>

        {fileName && (
          <div className="bg-muted/50 rounded-lg p-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">{rowCount} rows loaded</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
