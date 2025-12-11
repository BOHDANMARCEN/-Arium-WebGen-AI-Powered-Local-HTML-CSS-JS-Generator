# 📡 API Документація

Документація API endpoints для Arium WebGen.

## 📋 Зміст

- [Generate Code](#generate-code)
- [Get Models](#get-models)
- [Get Default Provider](#get-default-provider)

## 🔧 Endpoints

### Generate Code

Генерує HTML/CSS/JS код на основі текстового опису.

**Endpoint:** `POST /api/generate-code`

**Request Body:**

```typescript
{
  prompt: string;                    // Опис веб-сторінки
  model: string;                     // Назва моделі
  provider: string;                   // Провайдер (ollama, lm_studio, deepseek, openai_compatible)
  maxTokens?: number;                 // Максимальна кількість токенів (опціонально)
  customSystemPrompt?: string;        // Кастомний системний промпт (опціонально)
}
```

**Response:**

Streaming response з HTML кодом.

**Приклад використання:**

```typescript
const response = await fetch('/api/generate-code', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Створи лендінг для мобільного застосунку у фіолетових тонах',
    model: 'mistral',
    provider: 'ollama',
    maxTokens: 4000,
  }),
});

const reader = response.body?.getReader();
// Обробка streaming відповіді
```

**Thinking Models:**

Для thinking моделей (Qwen, DeepCoder) відповідь містить блок міркувань:

```html
<think>
  [Процес міркування AI]
</think>
<!DOCTYPE html>
...
```

### Get Models

Отримує список доступних моделей для вибраного провайдера.

**Endpoint:** `GET /api/get-models?provider={provider}`

**Query Parameters:**

- `provider` (required): Провайдер (ollama, lm_studio, deepseek, openai_compatible)

**Response:**

```typescript
{
  models: string[];  // Масив назв моделей
}
```

**Приклад використання:**

```typescript
const response = await fetch('/api/get-models?provider=ollama');
const data = await response.json();
console.log(data.models); // ['llama2', 'mistral', 'codellama', ...]
```

**Помилки:**

- `400 Bad Request` - Неправильний провайдер
- `500 Internal Server Error` - Помилка підключення до провайдера

### Get Default Provider

Отримує провайдера за замовчуванням з конфігурації.

**Endpoint:** `GET /api/get-default-provider`

**Response:**

```typescript
{
  provider: string;  // Назва провайдера за замовчуванням
}
```

**Приклад використання:**

```typescript
const response = await fetch('/api/get-default-provider');
const data = await response.json();
console.log(data.provider); // 'lm_studio'
```

## 🔐 Аутентифікація

API endpoints не вимагають аутентифікації, але деякі провайдери потребують API ключів, які налаштовуються через змінні оточення.

## ⚠️ Обмеження

### Rate Limiting

- Локальні провайдери (Ollama, LM Studio): Без обмежень
- Хмарні провайдери: Залежить від провайдера

### Token Limits

- Рекомендований максимум: 8000 токенів
- Мінімум: 100 токенів

### Timeout

- Локальні провайдери: 5 хвилин
- Хмарні провайдери: 2 хвилини

## 🐛 Обробка помилок

### Формат помилки

```typescript
{
  error: string;  // Опис помилки
}
```

### Типові помилки

**400 Bad Request:**
```json
{
  "error": "Missing required parameter: prompt"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Cannot connect to Ollama. Is the server running?"
}
```

## 📝 Приклади

### Повний приклад генерації коду

```typescript
async function generateWebsite(description: string) {
  try {
    const response = await fetch('/api/generate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: description,
        model: 'mistral',
        provider: 'ollama',
        maxTokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const reader = response.body?.getReader();
    let code = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      code += chunk;
    }

    return code;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}
```

### Отримання доступних моделей

```typescript
async function getAvailableModels(provider: string) {
  try {
    const response = await fetch(`/api/get-models?provider=${provider}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}
```

## 🔄 WebSocket (майбутнє)

Планується додати WebSocket підтримку для real-time генерації та оновлень.

## 📚 Додаткові ресурси

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [OpenAI Streaming](https://platform.openai.com/docs/api-reference/streaming)

