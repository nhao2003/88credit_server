import { LoanReasonTypes } from '../../src/constants/enum';
import { LoanContractRequestStatus } from '../../src/constants/enum';

export function genFloatNumber(from: number, to: number): number {
  return Math.round((Math.random() * (to - from) + from) * 100) / 100;
}

export function functionGenPictureUrl(): string {
  // https://picsum.photos/200/300?random=1
  const random = Math.round(Math.random() * 1000000000);
  return `https://picsum.photos/200/300?random=${random}`;
}

export function genArrayPictureUrl(length?: number): string[] {
  length = length || Math.round(Math.random() * 10);
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    result.push(functionGenPictureUrl());
  }
  return result;
}

const loanReasons: string[] = Object.values(LoanReasonTypes);
export function genLoanReason(): string {
  return loanReasons[Math.floor(Math.random() * loanReasons.length)];
}
export function generateRandomText(length: number = 100, words?: string[]): string {
  if (!words) {
    // Sử dụng một danh sách từ vựng ngẫu nhiên để sinh văn bản
    words = ['apple', 'banana', 'orange', 'dog', 'cat', 'sun', 'moon', 'happy', 'sad', 'random'];
  }

  const randomText: string[] = [];

  for (let i = 0; i < length; i++) {
    const word: string = words[Math.floor(Math.random() * words.length)];
    randomText.push(word);
  }

  return randomText.join(' ');
}

export function genLoanContractRequestStatus(): string {
  const statuses: string[] = Object.values(LoanContractRequestStatus);
  return statuses[Math.floor(Math.random() * statuses.length)];
}