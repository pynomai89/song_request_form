import { Client } from '@notionhq/client';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { song, url, user, constant, description } = req.body;
    
    // 入力必須項目の検証
    if (!song || !url || !user) {
        return res.status(400).json({ error: 'song, URL, user は必須項目です。' });
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

        // constantが入力された場合のみプロパティに追加
        if (constant) {
            properties.constant = {
                number: parseFloat(constant),
            };
        }

        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: properties,
        });

        res.status(200).json({ success: true, pageId: response.id });
    } catch (error) {
        console.error('Notion API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}