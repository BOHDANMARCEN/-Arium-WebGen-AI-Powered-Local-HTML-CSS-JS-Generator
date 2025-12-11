# 🌐 Arium WebGen — AI-Powered Local HTML/CSS/JS Generator

<div align="center">

**Легкий. Швидкий. Локальний. Ідеальний супутник для Arium IDE.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Демо](#) • [Документація](#-документація) • [Проблеми](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/issues) • [Обговорення](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/discussions)

</div>

---

## 📖 Про проєкт

**Arium WebGen** — це сучасний локальний AI-генератор веб-сторінок, який створює повноцінні HTML, CSS та JavaScript-сторінки на основі звичайних текстових описів. Проєкт працює повністю локально (Ollama / LM Studio) або через будь-який OpenAI-сумісний API.

Це мінімалістичний, швидкий інструмент для розробників, дизайнерів та AI-ентузіастів — а також ключовий компонент екосистеми **Arium**.

### ✨ Основні можливості

- 🤖 **AI-генерація веб-сторінок** — Створюй повноцінні веб-сторінки з природних описів
- 👁️ **Live Preview** — Переглядай результат у реальному часі на різних пристроях (Desktop, Mobile, Tablet)
- ✏️ **Вбудований редактор коду** — Monaco Editor для редагування коду на льоту
- 🔌 **Підтримка множини AI-провайдерів** — Ollama, LM Studio, DeepSeek, OpenAI-сумісні API
- 🧠 **Thinking Models** — Підтримка моделей з міркуваннями (Qwen, DeepCoder тощо)
- 🎨 **Сучасний UI** — Темний інтерфейс на базі Next.js 15, React 19, Tailwind CSS та shadcn/ui
- 🐳 **Docker підтримка** — Легкий запуск через Docker контейнер

---

## 🚀 Швидкий старт

### Вимоги

- Node.js 20+ або Docker
- npm, yarn або pnpm
- (Опціонально) Ollama або LM Studio для локальних моделей

### Встановлення

1. **Клонуйте репозиторій:**

```bash
git clone https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator.git
cd -Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator
```

2. **Встановіть залежності:**

```bash
npm install
# або
yarn install
# або
pnpm install
```

3. **Налаштуйте змінні оточення:**

Створіть файл `.env.local` в корені проєкту:

```env
# DeepSeek Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# Local Providers (Ollama)
OLLAMA_API_BASE=http://localhost:11434

# Local Providers (LM Studio)
LM_STUDIO_API_BASE=http://localhost:1234/v1

# Custom OpenAI-compatible API
# OPENAI_COMPATIBLE_API_KEY=your_key_here
# OPENAI_COMPATIBLE_API_BASE=https://api.provider.com/v1

# Default Provider (ollama, lm_studio, deepseek, openai_compatible)
DEFAULT_PROVIDER=lm_studio
```

4. **Запустіть проєкт:**

```bash
npm run dev
# або
yarn dev
# або
pnpm dev
```

5. **Відкрийте браузер:**

Перейдіть на [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker

### Запуск через Docker

```bash
docker build -t arium-webgen .
docker run -p 3000:3000 \
  -e DEFAULT_PROVIDER=lm_studio \
  -e OLLAMA_API_BASE=http://host.docker.internal:11434 \
  -e LM_STUDIO_API_BASE=http://host.docker.internal:1234/v1 \
  arium-webgen
```

### Docker Compose

```yaml
version: '3.8'
services:
  webgen:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DEFAULT_PROVIDER=lm_studio
      - OLLAMA_API_BASE=http://host.docker.internal:11434
      - LM_STUDIO_API_BASE=http://host.docker.internal:1234/v1
```

---

## 🧠 Підтримувані провайдери

### 🔸 Локальні моделі

#### Ollama
- **Опис:** Локальні AI-моделі через Ollama
- **Налаштування:** Встановіть [Ollama](https://ollama.ai/) та запустіть сервер
- **API Base:** `http://localhost:11434`
- **API Key:** Не потрібен

#### LM Studio
- **Опис:** Локальні AI-моделі через LM Studio
- **Налаштування:** Встановіть [LM Studio](https://lmstudio.ai/) та запустіть локальний сервер
- **API Base:** `http://localhost:1234/v1`
- **API Key:** Не потрібен

### 🔸 Хмарні провайдери

#### DeepSeek
- **Опис:** AI-моделі від DeepSeek
- **Налаштування:** Отримайте API ключ на [DeepSeek](https://www.deepseek.com/)
- **API Base:** `https://api.deepseek.com/v1`
- **API Key:** Потрібен

#### Custom OpenAI-compatible API
- **Опис:** Будь-який OpenAI-сумісний API
- **Підтримувані сервіси:** OpenAI, Together AI, Anyscale, Groq, Claude AI, Anthropic та інші
- **Налаштування:** Вкажіть базовий URL та API ключ у `.env.local`

---

## 🛠 Як користуватись

### Базове використання

1. **Введіть опис веб-сторінки**
   - Наприклад: "Створи лендінг для мобільного застосунку у фіолетових тонах з анімаціями"

2. **Оберіть AI-провайдера та модель**
   - Виберіть провайдера (Ollama, LM Studio, DeepSeek тощо)
   - Оберіть модель з доступних

3. **Налаштуйте параметри (опціонально)**
   - Системний промпт (default, thinking, custom)
   - Максимальна кількість токенів

4. **Натисніть GENERATE**
   - AI почне генерувати код у реальному часі
   - Для thinking моделей ви побачите процес міркування

5. **Переглядайте та редагуйте**
   - Переглядайте результат у Live Preview
   - Редагуйте код у вбудованому редакторі
   - Перемикайтеся між Desktop, Mobile та Tablet режимами

6. **Експортуйте результат**
   - Копіюйте код або зберігайте локально

### Розширені можливості

- **Thinking Models:** Використовуйте моделі з міркуваннями для кращого розуміння процесу генерації
- **Custom System Prompts:** Створюйте власні системні промпти для специфічних завдань
- **Token Limits:** Налаштуйте максимальну кількість токенів для контролю довжини відповіді

---

## 📁 Структура проєкту

```
Arium-WebGen/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate-code/ # Генерація коду
│   │   ├── get-models/    # Отримання моделей
│   │   └── get-default-provider/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Головна сторінка
├── components/            # React компоненти
│   ├── ui/               # shadcn/ui компоненти
│   ├── code-editor.tsx   # Monaco Editor
│   ├── generation-view.tsx
│   ├── welcome-view.tsx
│   └── ...
├── lib/                  # Утиліти та конфігурація
│   ├── providers/        # Конфігурація провайдерів
│   └── utils.ts
├── public/               # Статичні файли
├── Dockerfile           # Docker конфігурація
├── package.json
└── README.md
```

---

## 🗺 Roadmap

### 🧩 Моделі та провайдери

- [x] Ollama support
- [x] LM Studio support
- [x] DeepSeek
- [x] OpenAI-compatible API
- [x] Thinking Models Support (Qwen, DeepCoder, тощо)
- [ ] Anthropic Claude
- [ ] Groq
- [ ] Together AI
- [ ] Perplexity

### 🧱 Генерація коду

- [ ] Багатофайлова структура (index.html, style.css, app.js)
- [ ] ZIP-експорт проєктів
- [ ] Agentic diff-editing
- [ ] Проекти: зберігання / історія
- [ ] Версіонування згенерованого коду

### 🎨 Інтерфейс

- [ ] Світла тема
- [ ] Персональні налаштування редактора
- [ ] Drag-and-drop UI компонентів
- [ ] Темплейти та приклади
- [ ] Історія генерацій

### 💻 Desktop-версія

- [ ] Electron-додаток
- [ ] Нативні сповіщення
- [ ] Офлайн режим

### 🔧 Інструменти розробника

- [ ] CLI версія
- [ ] VS Code розширення
- [ ] API для інтеграцій

---

## 🤝 Внесок у проєкт

Ми вітаємо внески! Будь ласка, прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) для деталей про наш кодекс поведінки та процес надсилання pull requests.

### Як внести свій внесок

1. Fork проєкт
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push до branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

---

## 📚 Документація

- [Налаштування провайдерів](docs/PROVIDERS.md)
- [API документація](docs/API.md)
- [Розробка](docs/DEVELOPMENT.md)

---

## 🐛 Проблеми та підтримка

Якщо ви знайшли помилку або маєте пропозицію, будь ласка:
- Перевірте [існуючі issues](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/issues)
- Створіть [новий issue](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/issues/new) з детальним описом

---

## 📄 Ліцензія

Цей проєкт ліцензовано під MIT License - дивіться файл [LICENSE](LICENSE) для деталей.

---

## 🙏 Подяки

- [Next.js](https://nextjs.org/) за чудовий фреймворк
- [shadcn/ui](https://ui.shadcn.com/) за компоненти UI
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) за редактор коду
- Всі контриб'ютори та користувачі проєкту

---

<div align="center">

**Зроблено з ❤️ для спільноти розробників**

[⭐ Поставити зірку](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator) • [🐛 Повідомити про помилку](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/issues) • [💬 Обговорення](https://github.com/BOHDANMARCEN/-Arium-WebGen-AI-Powered-Local-HTML-CSS-JS-Generator/discussions)

</div>
