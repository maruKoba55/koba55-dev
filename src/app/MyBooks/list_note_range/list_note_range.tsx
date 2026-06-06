'use client';

import { Fragment, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/lib/Client';
import { X } from 'lucide-react';
import { CommonButton } from '@/components/ui/button';
import { useSystemConstant, useBookRoleMaster, useBookClassMaster, useBookTypeMaster } from '@/context/AppContext';

type RangeNote = {
  note_id: number;
  book_id: number;
  read_st_date: string | null;
  read_ed_date: string | null;
  note: string | null;
  isbn13: string | null;
  title: string | null;
  publisher: string | null;
  publish_series: string | null;
  first_publish_year: number;
  bookclass_cd: string | null;
  role_cd: string | null;
  person_name: string | null;
};

export default function ListNoteRange() {
  const supabase = supabaseClient();
  const searchParams = useSearchParams();
  const s_read_st_from = searchParams.get('read_st_from');
  const s_read_st_to = searchParams.get('read_st_to');
  const s_isbn13 = searchParams.get('isbn13');
  const s_title = searchParams.get('title');
  const s_title_search_type = searchParams.get('title_search_type');
  const s_publisher = searchParams.get('publisher');
  const s_publish_series = searchParams.get('publish_series');
  const s_role_cd = searchParams.get('role_cd');
  const s_person_name = searchParams.get('person_name');
  const s_person_search_type = searchParams.get('person_search_type');
  const s_bookclass_cd = searchParams.get('bookclass_cd');
  const s_booktype_cd = searchParams.get('booktype_cd');
  const [notes, setNotes] = useState<RangeNote[]>([]);
  const [loading, setLoading] = useState(true); // 読み込み状態を管理

  // システム変数、マスタ値取得（カスタムフック）
  const sqlLimit = parseInt(useSystemConstant('sqlLimit') as string) || 0;
  const supabaseMaxRows = parseInt(useSystemConstant('supabaseMaxRows') as string) || 0;
  const listAlert = parseInt(useSystemConstant('listAlert') as string) || 0;
  const bookRoleMaster = useBookRoleMaster();
  const bookClassMaster = useBookClassMaster();
  const bookTypeMaster = useBookTypeMaster();

  // 見出し文字
  // 書籍分類／書籍種別
  let subTitle1 = null;
  let subTitle2 = null;
  if (s_bookclass_cd) {
    subTitle1 = bookClassMaster.find((item: any) => item.bookclass_cd === s_bookclass_cd)?.bookclass || null;
  }
  if (s_booktype_cd) {
    subTitle2 = bookTypeMaster.find((item: any) => item.booktype_cd === s_booktype_cd)?.booktype || null;
    if (subTitle1) {
      subTitle1 = subTitle1 + '／' + subTitle2;
    } else {
      subTitle1 = subTitle2;
    }
  }
  if (subTitle1) {
    subTitle1 = `【${subTitle1}】`;
  }
  // 読書開始日 From～To
  const dateMin = '0001-01-01'; // 日付最小値
  const dateMax = '9999-12-31'; // 日付最大値
  subTitle2 = null;
  if (s_read_st_from != dateMin) {
    subTitle2 = s_read_st_from + '～';
  }
  if (s_read_st_to != dateMax) {
    if (subTitle2) {
      subTitle2 = subTitle2 + s_read_st_to;
    } else {
      subTitle2 = '～' + s_read_st_to;
    }
  }
  // データ取得
  // 範囲日付の編集
  let dateFrom = dateMin; // 日付最小値
  let dateTo = dateMax; // 日付最大値
  if (s_read_st_from) dateFrom = s_read_st_from;
  if (s_read_st_to) dateTo = s_read_st_to;
  let dateTmp = new Date(dateTo); //to日付を画面指定の1日後として、lt（より前）で検索する
  dateTmp.setDate(dateTmp.getDate() + 1);
  dateTo = `${dateTmp.getFullYear()}-${dateTmp.getMonth() + 1}-${dateTmp.getDate()}`;
  const dateParts = dateTo.split('-'); // 先行ゼロが欠落した場合のパディング
  if (dateParts[0].length < 4 || dateParts[1].length < 2 || dateParts[2].length < 2) {
    const yyyy = dateParts[0].padStart(4, '0');
    const mm = dateParts[1].padStart(2, '0');
    const dd = dateParts[2].padStart(2, '0');
    dateTo = `${yyyy}-${mm}-${dd}`;
  }
  // RPCに渡す検索最大件数
  const dbSearchMax = sqlLimit === 0 || sqlLimit > supabaseMaxRows ? supabaseMaxRows : sqlLimit;

  const fetchNotes = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('search_note_range', {
      p_read_st_from: dateFrom as string,
      p_read_st_to: dateTo as string,
      p_isbn13: (s_isbn13 as string) || null,
      p_title: (s_title as string) || null,
      p_title_search_type: (s_title_search_type as string) || 'top',
      p_publisher: (s_publisher as string) || null,
      p_publish_series: (s_publish_series as string) || null,
      p_role_cd: (s_role_cd as string) || null,
      p_person_name: (s_person_name as string) || null,
      p_person_search_type: (s_person_search_type as string) || 'top',
      p_bookclass_cd: (s_bookclass_cd as string) || null,
      p_booktype_cd: (s_booktype_cd as string) || null,
      p_select_limit: (dbSearchMax as number) || 9999
    });
    if (error) console.error(error);
    else {
      setNotes(data || []);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  //初期表示件数確認
  useEffect(() => {
    if (!loading && notes.length === 0) {
      alert('該当するノートがありません。');
      window.close();
      return;
    }
    if (listAlert > 0 && notes.length > listAlert) {
      const confirmed = window.confirm(`該当データ${notes.length}件。時間のかかる場合がありますが続けますか？`);
      if (!confirmed) {
        window.close();
        return;
      }
    }
  }, [loading, notes]);

  // ［閉じる］ボタンの処理
  const handleClose = () => {
    window.close();
  };
  useHotkeys('alt+c', (event) => {
    event.preventDefault(); // ブラウザのデフォルト挙動を防止
    handleClose();
  });

  const screenMinW = 800;

  return (
    <div style={{ minWidth: `${screenMinW}px` }} className="w-full">
      <div
        style={{ width: `${screenMinW + 8}px` }}
        className="text-center text-3xl font-bold underline bg-cyan-500 mx-2"
      >
        書籍管理（ノート一覧）
      </div>
      <div style={{ width: `${screenMinW}px` }} className="border-solid border-2 rounded-lg flex m-2 p-2">
        <div className="mb-1">
          <div className="flex justify-end mr-2">
            {subTitle1} {subTitle2}
          </div>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full table-fixed text-left text-sm">
              {/* 列幅を固定 */}
              <colgroup>
                <col className="w-9" />
                <col className="w-22" />
                <col className="w-22" />
                <col />
              </colgroup>
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th colSpan={4} className="p-1 font-bold text-blue-600">
                    <span className="text-white bg-gray-400 w-9 p-1">No.</span> 『タイトル』　著者等
                    （出版社／出版シリーズ、初版年）
                    <span className=" text-green-500 p-1 ml-2">［書籍分類］</span>
                  </th>
                </tr>
                <tr>
                  <th className="p-1"></th>
                  <th className="p-1">読書開始</th>
                  <th className="p-1">読書終了</th>
                  <th className="p-1">ノート</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note, i) => (
                  <Fragment key={note.note_id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td colSpan={4}>
                        <div className="flex">
                          <div className="flex text-white bg-gray-400 min-w-9 align-top justify-end p-1"> {i + 1}</div>
                          <div className="p-1 font-bold text-blue-600">
                            『{note.title}』
                            {note.role_cd && note.person_name
                              ? `　${note.person_name.replace(/\s+/g, '')}（${bookRoleMaster.find((item: any) => item.role_cd === note.role_cd)?.role_name || null}）`
                              : ''}
                            （{note.publisher}
                            {note.publish_series ? `／${note.publish_series}` : ''}、{note.first_publish_year}）
                            {note.bookclass_cd ? (
                              <span className=" text-green-500 p-1 ml-2">
                                ［
                                {bookClassMaster.find((item: any) => item.bookclass_cd === note.bookclass_cd)
                                  ?.bookclass || null}
                                ］
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1"></td>
                      <td className="p-1">{note.read_st_date}</td>
                      <td className="p-1">{note.read_ed_date}</td>
                      <td className="p-1 whitespace-pre-wrap break-words">{note.note}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ボタンエリア */}
      <div className="flex m-2 justify-around">
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
