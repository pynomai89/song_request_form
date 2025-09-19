import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function POST(request) {
  const body = await request.json();
  const { song, url, user, constant, intPart, decimalPart, description, junre } = body;

  if (!song || !url || !user) {
    return NextResponse.json(
      { error: 'song, URL, user は必須項目です。' },
      { status: 400 }
    );
  }

  const notion = new Client({ auth: process.env.API_KEY });
  const databaseId = process.env.DB_ID;

  try {
    const properties = {
        song: {
            title: [
                {
                    text: {
                        content: song,
                    },
                },
            ],
        },
        URL: {
            url: url,
        },
        user: {
            rich_text: [
                {
                    text: {
                        content: user,
                    },
                },
            ],
        },
        status: {
            status: {
                name: "未実装",
            },
        },
        done: {
            checkbox: false,
        },
        description: {
            rich_text: [
                {
                    text: {
                        content: description || "",
                    },
                },
            ],
        },
    };

    const children = [
        {
            object: 'block',
            type: 'embed',
            embed: {
            url: url,
            },
        },
        {
            object: 'block',
            type: 'callout',
            callout: {
            rich_text: [
                {
                type: 'text',
                text: {
                    content: description || '（説明なし）',
                },
                },
            ],
            icon: {
                type: 'emoji',
                emoji: '💡',
            },
            },
        },
    ];


    if (junre) {
        // junreが空なら "未分類" を設定
        properties.junre = {
        select: { name: junre && junre.trim() !== '' ? junre : '未分類' },
        };
    }

    if (constant) {
        let constantValue = -1;  // -1 は譜面定数未定義状態
        if (intPart && decimalPart) {
            constantValue = parseFloat(intPart) + parseFloat(decimalPart) / 10;
            children.push({
                object: 'block', type: 'paragraph',
                paragraph: { rich_text: [{ type: 'text', text: { content: `譜面定数: ${constantValue.toFixed(1)}` } }] }
            });
        }
        else if (intPart) {
            constantValue = parseInt(intPart);
            children.push({
                object: 'block', type: 'paragraph',
                paragraph: { rich_text: [{ type: 'text', text: { content: `難易度: ${constantValue}` } }] }
            });
        }

        properties.constant = {
            number: constantValue,
        };
    }


    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
      children: children,
    });

    return NextResponse.json({ success: true, pageId: response.id });
  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}