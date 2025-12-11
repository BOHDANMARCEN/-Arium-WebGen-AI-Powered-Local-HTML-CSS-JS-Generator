# 🛠 Документація для розробників

Цей документ містить інформацію для розробників, які хочуть внести свій внесок або розширити функціональність Arium WebGen.

## 📋 Зміст

- [Налаштування середовища розробки](#налаштування-середовища-розробки)
- [Архітектура проєкту](#архітектура-проєкту)
- [Додавання нового провайдера](#додавання-нового-провайдера)
- [Додавання нової функції](#додавання-нової-функції)
- [Тестування](#тестування)
- [Debugging](#debugging)

## 🚀 Налаштування середовища розробки

### Вимоги

- Node.js 20+
- npm, yarn або pnpm
- Git
- (Опціонально) Docker для контейнеризації

### Кроки встановлення

1. **Клонуйте репозиторій:**

```bash
git clone https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator.git
cd -Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator
```

2. **Встановіть залежності:**

```bash
npm install
```

3. **Налаштуйте змінні оточення:**

Створіть `.env.local`:

```env
DEFAULT_PROVIDER=lm_studio
OLLAMA_API_BASE=http://localhost:11434
LM_STUDIO_API_BASE=http://localhost:1234/v1
DEEPSEEK_API_KEY=your_key_here
DEEPSEEK_API_BASE=https://api.deepseek.com/v1
```

4. **Запустіть dev сервер:**

```bash
npm run dev
```

## 🏗 Архітектура проєкту

### Структура директорій

```
Arium-WebGen/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate-code/        # Генерація коду
│   │   ├── get-models/           # Отримання моделей
│   │   └── get-default-provider/ # Провайдер за замовчуванням
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Головна сторінка
│   └── globals.css               # Глобальні стилі
├── components/                   # React компоненти
│   ├── ui/                      # shadcn/ui компоненти
│   ├── code-editor.tsx          # Monaco Editor wrapper
│   ├── generation-view.tsx      # View для генерації
│   ├── welcome-view.tsx         # Початковий екран
│   ├── provider-selector.tsx   # Вибір провайдера
│   └── ...
├── lib/                         # Утиліти та конфігурація
│   ├── providers/              # Конфігурація провайдерів
│   │   ├── config.ts           # Конфігурація провайдерів
│   │   └── provider.ts         # Логіка провайдерів
│   └── utils.ts                # Допоміжні функції
├── hooks/                      # Custom React hooks
├── public/                     # Статичні файли
└── ...
```

### Технологічний стек

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Code Editor:** Monaco Editor
- **HTTP Client:** Fetch API
- **Type Safety:** TypeScript 5

### Потік даних

```
User Input → WelcomeView → API Route → AI Provider → Streaming Response → GenerationView
```

## ➕ Додавання нового провайдера

### Крок 1: Додайте конфігурацію

Відредагуйте `lib/providers/config.ts`:

```typescript
export enum LLMProvider {
  // ... існуючі провайдери
  NEW_PROVIDER = 'new_provider',
}

export const PROVIDER_CONFIGS: Record<LLMProvider, ProviderConfig> = {
  // ... існуючі конфігурації
  [LLMProvider.NEW_PROVIDER]: {
    id: LLMProvider.NEW_PROVIDER,
    name: 'New Provider',
    description: 'Description of new provider',
    baseUrlEnvVar: 'NEW_PROVIDER_API_BASE',
    apiKeyEnvVar: 'NEW_PROVIDER_API_KEY',
    defaultBaseUrl: 'https://api.newprovider.com/v1',
    isLocal: false,
  },
};
```

### Крок 2: Додайте обробку в API

Відредагуйте `app/api/generate-code/route.ts`:

```typescript
// Додайте обробку нового провайдера
case LLMProvider.NEW_PROVIDER:
  // Логіка для нового провайдера
  break;
```

### Крок 3: Оновіть компоненти

Переконайтеся, що `components/provider-selector.tsx` підтримує новий провайдер (він автоматично підхопить з конфігурації).

### Крок 4: Додайте документацію

Оновіть `docs/PROVIDERS.md` з інформацією про новий провайдер.

## 🎨 Додавання нової функції

### Приклад: Додавання експорту в ZIP

1. **Створіть утиліту:**

```typescript
// lib/utils/export.ts
export async function exportToZip(html: string, css: string, js: string) {
  // Логіка експорту
}
```

2. **Додайте компонент:**

```typescript
// components/export-button.tsx
export function ExportButton({ code }: { code: string }) {
  // UI компонент
}
```

3. **Інтегруйте в існуючий view:**

```typescript
// components/generation-view.tsx
import { ExportButton } from './export-button';

// Додайте кнопку в UI
```

## 🧪 Тестування

### Запуск тестів

```bash
npm test
```

### Написання тестів

Створіть тести в `__tests__/` або поруч з файлами:

```typescript
// __tests__/api/generate-code.test.ts
import { POST } from '@/app/api/generate-code/route';

describe('Generate Code API', () => {
  it('should generate code successfully', async () => {
    // Тестова логіка
  });
});
```

### E2E тестування

Використовуйте Playwright або Cypress для E2E тестів.

## 🐛 Debugging

### Dev Tools

1. **React DevTools:** Для відлагодження компонентів
2. **Next.js DevTools:** Вбудовані інструменти Next.js
3. **Browser DevTools:** Для відлагодження клієнтського коду

### Логування

```typescript
// Використовуйте console.log для розробки
console.log('Debug info:', data);

// Використовуйте console.error для помилок
console.error('Error:', error);
```

### Debugging API Routes

```typescript
// app/api/generate-code/route.ts
export async function POST(request: NextRequest) {
  console.log('Request received:', await request.json());
  // ... логіка
}
```

### Debugging Streaming

```typescript
// Для відлагодження streaming відповідей
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = new TextDecoder().decode(value);
  console.log('Chunk received:', chunk);
}
```

## 📦 Build та Deployment

### Локальний build

```bash
npm run build
npm start
```

### Docker build

```bash
docker build -t arium-webgen .
docker run -p 3000:3000 arium-webgen
```

### Vercel Deployment

Проєкт готовий до деплою на Vercel:

1. Підключіть GitHub репозиторій
2. Налаштуйте змінні оточення
3. Deploy

## 🔍 Code Style

### Prettier

```bash
npm run format
```

### ESLint

```bash
npm run lint
```

### TypeScript

```bash
npm run type-check
```

## 📚 Корисні ресурси

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 💡 Поради

1. **Використовуйте TypeScript:** Додавайте типи для всіх функцій
2. **Дотримуйтесь структури:** Дотримуйтесь існуючої структури проєкту
3. **Коментуйте складний код:** Додавайте коментарі там, де це необхідно
4. **Тестуйте зміни:** Перевіряйте зміни перед PR
5. **Оновлюйте документацію:** Оновлюйте README та іншу документацію

## ❓ Питання?

Якщо у вас є питання:

- Відкрийте [Discussion](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/discussions)
- Створіть [Issue](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/issues)

