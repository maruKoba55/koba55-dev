'use client';

import { useHotkeys } from 'react-hotkeys-hook';
import { useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/lib/Client';
import { Save, RefreshCw, Trash2, X } from 'lucide-react';
import { CommonButton } from '@/components/ui/button';
import { SystemConstant } from '@/utils/getSystemConstants';

export default function MainteSystemConstants({
  constantAdd,
  dataList
}: {
  constantAdd: boolean;
  dataList: SystemConstant[];
}) {
  const supabase = supabaseClient();
  const searchParams = useSearchParams();
  const user = searchParams.get('user');
  console.log('dataList:', dataList);
  console.log('user:', user);

  //［閉じる］ボタンの処理
  const handleClose = () => {
    window.close();
  };
  useHotkeys('alt+c', (event) => {
    event.preventDefault(); // ブラウザのデフォルト挙動を防止
    handleClose(); // handlePrev内の「!isNextDisabled」判定が通る時だけ実行される
  });

  return (
    <div>
      <div>
        システム定数メンテ
        {constantAdd ? <div> 不足していたシステム定数を規定値で登録しました。</div> : ''}
      </div>
      <div>
        <CommonButton
          label={
            <>
              <X size={20} />
              閉じる (<u>C</u>)
            </>
          }
          variant="outline"
          onClick={handleClose}
        />
      </div>
    </div>
  );
}
