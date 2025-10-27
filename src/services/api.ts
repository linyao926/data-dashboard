import type { SaleRecord } from '../types';

let dataWorker: Worker | null = null;

// Type-safe worker messages
type WorkerMessage =
  | { type: 'PROGRESS'; stage: string; message: string; progress?: number }
  | { type: 'SUCCESS'; data: SaleRecord[] }
  | { type: 'ERROR'; error: string };

// Callback for progress updates (optional)
type ProgressCallback = (stage: string, message: string, progress?: number) => void;

export const fetchSalesData = (onProgress?: ProgressCallback): Promise<SaleRecord[]> => {
  return new Promise((resolve, reject) => {
    // Create worker
    dataWorker = new Worker(new URL('../workers/data.worker.ts', import.meta.url), {
      type: 'module',
    });

    // Listen for messages from worker
    dataWorker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;

      switch (message.type) {
        case 'PROGRESS':
          console.log(`[Worker] ${message.stage}: ${message.message}`);
          onProgress?.(message.stage, message.message, message.progress);
          break;

        case 'SUCCESS':
          console.log(`Worker completed: ${message.data.length} records`);
          dataWorker?.terminate();
          dataWorker = null;
          resolve(message.data);
          break;

        case 'ERROR':
          console.error(`❌ Worker error: ${message.error}`);
          dataWorker?.terminate();
          dataWorker = null;
          reject(new Error(message.error));
          break;
      }
    };

    // Handle worker errors
    dataWorker.onerror = (error) => {
      console.error('❌ Worker error:', error);
      dataWorker?.terminate();
      dataWorker = null;
      reject(new Error('Worker failed'));
    };

    // Start fetching
    dataWorker.postMessage({ type: 'FETCH_DATA' });
  });
};

// Cancel ongoing fetch (if needed)
export const cancelFetch = (): void => {
  if (dataWorker) {
    console.log('🛑 Cancelling fetch...');
    dataWorker.terminate();
    dataWorker = null;
  }
};

// Helper: Get unique categories from data
export const getCategories = (data: SaleRecord[]): string[] => {
  const categories = new Set(data.map((record) => record.category));
  return ['All', ...Array.from(categories).sort()];
};

// Helper: Calculate date range from data
export const getDateRange = (data: SaleRecord[]): { min: string; max: string } => {
  const dates = data.map((r) => new Date(r.date).getTime()).sort((a, b) => a - b);

  if (dates.length === 0) {
    return { min: '', max: '' };
  }

  return {
    min: new Date(dates[0]).toISOString().split('T')[0],
    max: new Date(dates[dates.length - 1]).toISOString().split('T')[0],
  };
};

