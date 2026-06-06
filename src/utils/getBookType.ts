/* 書籍種別マスタ取得（サーバー用）
 * @param 特定の種別（booktypeCd）、すべて取得する場合は 'all' または省略
 */
import { supabaseServer } from '@/lib/Server';

export interface BookTypeMaster {
  booktype_cd: string;
  booktype: string;
  selectable: boolean;
}

export async function getBookType(booktypeCd: string | 'all' = 'all'): Promise<BookTypeMaster[] | null> {
  const supabase = await supabaseServer();
  let query = supabase.from('booktype_master').select('booktype_cd, booktype, selectable').order('booktype_cd');
  if (booktypeCd !== 'all') {
    query = query.eq('booktype_cd', booktypeCd);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching booktype_master:', error.message);
    throw error;
  }

  return data as BookTypeMaster[];
}
