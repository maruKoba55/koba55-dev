'use client';

import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSearchParams } from 'next/navigation';
import { BookImage, FolderPen, Landmark, UserCheck, X } from 'lucide-react';
import { CommonButton } from '@/components/ui/button';

export default function DataMaint() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user');

  // 各ボタンの処理
  // ［システム定数］
  const handleSystemConstants = () => {
    const params = new URLSearchParams({
      user: user || ''
    });
    window.open(`/MyBooks/data_maintenance/system_constants/?${params.toString()}`, '_blank', 'width=1120,height=640');
  };
  // ［役割マスタ］
  const handleBookRoleMaster = () => {
    const params = new URLSearchParams({
      user: user || ''
    });
    window.open(`/MyBooks/data_maintenance/book_role_master/?${params.toString()}`, '_blank', 'width=1120,height=640');
  };
  // ［書籍形態マスタ］
  const handleBookFormMaster = () => {
    const params = new URLSearchParams({
      user: user || ''
    });
    window.open(`/MyBooks/data_maintenance/bookform_master/?${params.toString()}`, '_blank', 'width=1120,height=640');
  };
  // ［書籍分類マスタ］
  const handleBookClassMaster = () => {
    const params = new URLSearchParams({
      user: user || ''
    });
    window.open(`/MyBooks/data_maintenance/bookclass_master/?${params.toString()}`, '_blank', 'width=1120,height=640');
  };
  // ［閉じる］
  const handleClose = () => {
    window.close();
  };
  useHotkeys('alt+c', (event) => {
    event.preventDefault();
    handleClose();
  });

  const screenW = 800; //画面幅

  return (
    <div style={{ width: `${screenW}px` }}>
      <div className="text-center text-3xl font-bold underline bg-cyan-500">書籍管理</div>
      <div className="flex flex-col border-solid border-2 rounded-lg m-3 p-1">
        <div className="text-xl font-bold text-blue-500 m-1">データメンテナンス</div>
        <div className="flex flex-col justify-around ml-4 p-1">
          <div className="flex mt-2">
            <div className="flex flex-col justify-center w-38">
              <CommonButton
                label={
                  <>
                    <Landmark size={20} />
                    システム定数
                  </>
                }
                variant="orange"
                onClick={handleSystemConstants}
              />
            </div>
            <div className="flex flex-col justify-center ml-2">： </div>
            <div className="flex flex-col justify-center ml-2">
              書籍管理システムで参照する定数。定数名は変更できません。
              <br />
              定数値の変更は、システムのトップページを更新したタイミングで反映されます。
            </div>
          </div>
          <div className="flex mt-3">
            <div className="flex flex-col justify-center w-38">
              <CommonButton
                label={
                  <>
                    <UserCheck size={20} />
                    役割マスタ
                  </>
                }
                variant="orange"
                onClick={handleBookRoleMaster}
                disabled={true}
              />
            </div>
            <div className="flex flex-col justify-center ml-2">： </div>
            <div className="flex flex-col justify-center ml-2">
              既存の役割コードを変更すると、該当役割を持つすべてのデータが更新されます。
            </div>
          </div>
          <div className="flex mt-3">
            <div className="flex flex-col justify-center w-38">
              <CommonButton
                label={
                  <>
                    <BookImage size={20} />
                    書籍形態マスタ
                  </>
                }
                variant="orange"
                onClick={handleBookFormMaster}
                disabled={true}
              />
            </div>
            <div className="flex flex-col justify-center ml-2">： </div>
            <div className="flex flex-col justify-center ml-2">
              既存の形態コードを変更すると、該当形態を持つすべてのデータが更新されます。
            </div>
          </div>
          <div className="flex mt-3">
            <div className="flex flex-col justify-center w-38">
              <CommonButton
                label={
                  <>
                    <FolderPen size={20} />
                    書籍分類マスタ
                  </>
                }
                variant="orange"
                onClick={handleBookClassMaster}
                disabled={true}
              />
            </div>
            <div className="flex flex-col justify-center ml-2">： </div>
            <div className="flex flex-col justify-center ml-2">
              既存の分類コードを変更すると、該当分類を持つすべてのデータが更新されます。
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <div className="flex flex-col justify-center">
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
        </div>
      </div>
    </div>
  );
}
