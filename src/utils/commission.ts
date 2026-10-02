import { CommissionResult } from '@/types/sale';

// Aparelhos e Perfumes fechados - R$ 15,00
const HIGH_COMMISSION_KEYWORDS = [
  'ipad', 'celular', 'iphone', 'samsung', 'perfume', 'tablet', 
  'smartphone', 'galaxy', 'xiaomi', 'motorola', 'redmi', 'poco',
  'apple watch', 'airpods', 'macbook', 'notebook', 'fone bluetooth',
  'jbl', 'caixa de som', 'echo dot', 'alexa'
];

// Acessórios - R$ 5,00
const LOW_COMMISSION_KEYWORDS = [
  'decant', 'case', 'cabo', 'película', 'pelicula', 'caneta', 'canetas', 
  'kit teclado', 'cabos', 'fontes', 'powerbank', 'hubs', 'suporte', 'bolsa',
  'capa', 'capinha', 'carregador', 'adaptador', 'fone com fio', 'mouse',
  'teclado', 'pen drive', 'cartão de memória', 'sd card', 'protetor',
  'suporte veicular', 'tripé', 'selfie', 'ring light', 'pop socket'
];

const HIGH_COMMISSION_VALUE = 15;
const LOW_COMMISSION_VALUE = 5;

export interface ExtendedCommissionResult extends CommissionResult {
  needsUserInput: boolean;
}

export function calculateCommission(productName: string): CommissionResult {
  const normalizedProduct = productName.toLowerCase().trim();
  
  // Check for high commission products (Aparelhos e Perfumes)
  const isHighCommission = HIGH_COMMISSION_KEYWORDS.some(keyword => 
    normalizedProduct.includes(keyword)
  );
  
  if (isHighCommission) {
    return {
      value: HIGH_COMMISSION_VALUE,
      category: 'high',
      recognized: true
    };
  }
  
  // Check for low commission products (Acessórios)
  const isLowCommission = LOW_COMMISSION_KEYWORDS.some(keyword => 
    normalizedProduct.includes(keyword)
  );
  
  if (isLowCommission) {
    return {
      value: LOW_COMMISSION_VALUE,
      category: 'low',
      recognized: true
    };
  }
  
  // Product not recognized - needs user input
  return {
    value: 0,
    category: 'none',
    recognized: false
  };
}

export function calculateCommissionWithLearned(
  productName: string, 
  learnedCommission: number | null
): ExtendedCommissionResult {
  // First check if we have a learned commission for this product
  if (learnedCommission !== null) {
    return {
      value: learnedCommission,
      category: learnedCommission === 15 ? 'high' : 'low',
      recognized: true,
      needsUserInput: false
    };
  }

  // Try automatic classification
  const result = calculateCommission(productName);
  
  return {
    ...result,
    needsUserInput: !result.recognized
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
