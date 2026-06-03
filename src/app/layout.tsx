import type { Metadata } from 'next';
import { Noto_Sans_JP, Roboto_Mono } from 'next/font/google';
import { ConstantsProvider } from '@/context/ConstantsContext';
import { getConstantsServer } from '@/utils/getConstantsServer';
import './globals.css';

export const metadata: Metadata = {
  title: '書籍管理【開発】',
  description: 'Database for My Bookshelf'
};

// 日本語フォントの設定
const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp', // CSS変数の定義
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700']
});

// 欧文等幅フォントの設定
const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono', // CSS変数の定義
  subsets: ['latin'],
  display: 'swap'
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // システム定数をすべて取得
  const constants = await getConstantsServer('all');

  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${robotoMono.variable} antialiased`}>
        {/* システム定数をクライアント側のContextに流し込む */}
        <ConstantsProvider initialConstants={constants ?? []}> {children}</ConstantsProvider>
      </body>
    </html>
  );
}
