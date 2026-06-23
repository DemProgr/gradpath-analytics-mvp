import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const SYSTEM_PROMPT = `Ты - эксперт по образованию в Беларуси. Твоя задача - помочь абитуриенту с выбором вуза и специальности.

ВАЖНЕЙШИЕ ПРАВИЛА:
1. Внимательно читай ВСЕ что пишет пользователь - его баллы, предметы, интересы, город
2. Если пользователь указал предметы (например: английский, математика, биология, история) - НИКОГДА не предлагай специальности где нужно сдавать ДРУГИЕ предметы (например: физика, химия)
3. Если недостаточно данных - ОБЯЗАТЕЛЬНО спроси: какие предметы сдает/будет сдавать, сколько баллов, город, бюджет/платно

ПРАВИЛА ОТВЕТА:
1. Отвечай на РУССКОМ языке БЕЗ эмодзи
2. Если вопрос не про поступление - ответь прямо, не предлагай варианты вузов
3. При подборе специальности учитывай ВСЕ что указал пользователь: баллы, предметы, интересы, город
4. Предлагай только те специальности которые соответствуют указанным предметам
5. НЕ предсказывай зарплаты - укажи примерные профессии выпускника

ПРИ ОТВЕТЕ ОБЯЗАТЕЛЬНО:
- Укажи какие предметы нужно сдавать для каждой специальности
- Если пользователь уже указал предметы - проверь соответствие
- Если данных недостаточно - задай уточняющий вопрос`;

const OPENROUTER_MODEL = 'google/gemini-2.0-flash-001';

router.post('/', authMiddleware, async (c) => {
  try {
    const { message, history = [] } = await c.req.json();

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return c.json({ error: 'AI service not configured' }, 500);
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://gradpath-analytics.com',
        'X-Title': 'GradPath Analytics',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[AI-CHAT] OpenRouter error:', errorData);
      return c.json({ error: 'AI service error' }, 500);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return c.json({ error: 'Empty response from AI' }, 500);
    }

    return c.json({
      response: aiResponse,
      model: OPENROUTER_MODEL,
      usage: data.usage,
    });
  } catch (err) {
    console.error('[AI-CHAT] Error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;
