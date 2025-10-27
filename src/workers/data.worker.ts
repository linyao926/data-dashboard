const MOCKAROO_API_URL = 'https://api.mockaroo.com/api/c099b1d0?count=200&key=bab68140';

interface MockarooRecord {
  id: number;
  product: string;
  category: string;
  date: string;
  quantity: number;
  price: string;
  customer: string;
}

interface SaleRecord {
  id: string;
  product: string;
  category: string;
  date: string;
  quantity: number;
  price: number;
  amount: number;
  customer: string;
}

// Helper functions
const parsePrice = (priceString: string): number => {
  const cleaned = priceString.replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
};

const normalizeDate = (dateString: string): string => {
  try {
    const [month, day, year] = dateString.split('/');
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  } catch (error) {
    return dateString;
  }
};

// Main worker logic
self.addEventListener('message', async (event: MessageEvent) => {
  const { type } = event.data;

  if (type === 'FETCH_DATA') {
    try {
      // Stage 1: Fetching
      self.postMessage({ 
        type: 'PROGRESS', 
        stage: 'fetching',
        message: 'Fetching from Mockaroo API...' 
      });

      const response = await fetch(MOCKAROO_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Stage 2: Parsing
      self.postMessage({ 
        type: 'PROGRESS', 
        stage: 'parsing',
        message: 'Parsing response...' 
      });

      const rawData: MockarooRecord[] = await response.json();

      // Stage 3: Transforming (process in chunks to report progress)
      self.postMessage({ 
        type: 'PROGRESS', 
        stage: 'transforming',
        message: `Processing ${rawData.length} records...` 
      });

      const CHUNK_SIZE = 50;
      const transformedData: SaleRecord[] = [];

      for (let i = 0; i < rawData.length; i += CHUNK_SIZE) {
        const chunk = rawData.slice(i, i + CHUNK_SIZE);

        const transformed = chunk.map((record) => {
          const price = parsePrice(record.price);
          const amount = record.quantity * price;

          return {
            id: String(record.id),
            product: record.product,
            category: record.category,
            date: normalizeDate(record.date),
            quantity: record.quantity,
            price: price,
            amount: amount,
            customer: record.customer,
          };
        });

        transformedData.push(...transformed);

        // Report progress
        const progress = Math.round(((i + CHUNK_SIZE) / rawData.length) * 100);
        self.postMessage({
          type: 'PROGRESS',
          stage: 'transforming',
          message: `Processed ${Math.min(i + CHUNK_SIZE, rawData.length)}/${rawData.length} records`,
          progress,
        });
      }

      // Stage 4: Success
      self.postMessage({
        type: 'SUCCESS',
        data: transformedData,
      });
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});
