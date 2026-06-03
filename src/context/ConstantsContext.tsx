'use client';
import React, { createContext, useContext } from 'react';

// Contextの型定義
export interface SystemConstant {
  constant_name: string;
  constant_type: 'text' | 'numeric' | 'boolean' | 'timestamp';
  constant_value: string;
}
const ConstantsContext = createContext<SystemConstant[] | null>(null);

// プロバイダーコンポーネント（サーバーからデータを受け取る）
export function ConstantsProvider({
  children,
  initialConstants
}: {
  children: React.ReactNode;
  initialConstants: SystemConstant[];
}) {
  return <ConstantsContext.Provider value={initialConstants}>{children}</ConstantsContext.Provider>;
}

// 呼び出し用のカスタムフック
export function useSystemConstant(constantName: string): number | string | boolean | null {
  const constants = useContext(ConstantsContext);

  if (!constants) {
    throw new Error('useSystemConstant must be used within a ConstantsProvider');
  }

  // 指定された定数名を探す
  const target = constants.find((c) => c.constant_name === constantName);
  if (!target) return null;

  // 型（constant_type）に応じて適切に変換して返す
  switch (target.constant_type) {
    case 'numeric':
      return Number(target.constant_value);
    case 'boolean':
      return target.constant_value === 'true';
    default:
      return target.constant_value; // text や timestamp はそのまま文字列
  }
}
