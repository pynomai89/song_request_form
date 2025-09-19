import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function POST(request) {
  const body = await request.json();
  const { song, url, user, constant, description, junre } = body;

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

    if (junre) {
        // junreが空なら "未分類" を設定
        properties.junre = {
        select: { name: junre && junre.trim() !== '' ? junre : '未分類' },
        };
    }

    if (constant) {
      properties.constant = {
        number: parseFloat(constant),
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
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