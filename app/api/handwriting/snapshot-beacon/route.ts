import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { p_session_id, p_board_type, p_page_index, p_content }
    const supabase = await createClient();

    const { error } = await supabase
      .schema('edu_core')
      .rpc('save_board_snapshot', body);

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
