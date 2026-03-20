<p align="center">
  <img width="120" src="https://raw.githubusercontent.com/pelican-dev/panel/main/public/pelican.svg" alt="Pelican">
</p>

<h1 align="center">NLManager — Pelican Panel с темой NLTE</h1>

<p align="center">
  <a href="https://demo.nlmanager.cc"><strong>🚀 Живое демо → demo.nlmanager.cc</strong></a>
  &nbsp;·&nbsp;
  Логин: <code>demo@nlmanager.cc</code>
  &nbsp;·&nbsp;
  Пароль: <code>demo1234</code>
</p>

<p align="center">
  Форк <a href="https://github.com/pelican-dev/panel">Pelican Panel</a> с кастомной брутальной тёмной темой от <a href="https://nlte.cloud"><strong>NLTE.cloud</strong></a>
</p>

---

---

## Что это

**NLManager** — это веб-панель для управления игровыми серверами на базе открытого проекта Pelican Panel.  
Мы переработали визуальную часть в стиле **Industrial Cyber-Brutalism** — тёмный фон, золотые акценты, терминальная эстетика.

Панель управляет серверами через демон **Wings** (Docker), поддерживает сотни игр и не требует глубоких технических знаний.

---

## Особенности темы NLTE

- Полностью тёмный интерфейс (принудительный dark mode)
- Золотая палитра акцентов (`#D4A373`) вместо стандартной синей
- Анимации при загрузке: boot-оверлей, scanlines, reveal-эффекты
- Переработанные страницы ошибок в стиле терминала
- Кастомный стиль для всех трёх панелей: Admin / App / Server

---

## Требования

| Компонент | Версия |
|-----------|--------|
| PHP | 8.3+ |
| Composer | 2.x |
| Node.js | 22+ |
| npm | 10+ |
| БД | SQLite / MySQL / PostgreSQL |
| Веб-сервер | nginx / Apache |

---

## Быстрая установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/nethercoded/pelican-nlte-theme.git /var/www/nlmanager
cd /var/www/nlmanager

# 2. Установить PHP-зависимости
composer install --no-dev --optimize-autoloader

# 3. Установить Node-зависимости и собрать ассеты
npm install
npm run build

# 4. Настроить окружение
cp .env.example .env
php artisan key:generate

# 5. Настроить базу данных (SQLite — самый простой вариант)
touch database/database.sqlite
php artisan migrate --seed

# 6. Настроить права
chown -R www-data:www-data /var/www/nlmanager
chmod -R 755 storage bootstrap/cache
```

---

## Настройка nginx

```nginx
server {
    listen 80;
    server_name panel.example.com;
    root /var/www/nlmanager/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

---

## Queue Worker (обязательно)

Без очереди не будут работать установка серверов и импорт яиц:

```bash
php artisan queue:work --sleep=3 --tries=3
```

Или через Supervisor (`/etc/supervisor/conf.d/nlmanager-queue.conf`):

```ini
[program:nlmanager-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/nlmanager/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
numprocs=2
user=www-data
```

```bash
supervisorctl reread && supervisorctl update && supervisorctl start nlmanager-queue:*
```

---

## Wings (демон серверов)

Для реального управления серверами нужен [Wings](https://github.com/pelican-dev/wings).  
Без Wings панель работает, но серверы будут отображаться как offline.

---

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `APP_URL` | URL панели (например `https://panel.example.com`) |
| `APP_KEY` | Генерируется через `php artisan key:generate` |
| `DB_CONNECTION` | `sqlite`, `mysql` или `pgsql` |
| `QUEUE_CONNECTION` | Рекомендуется `database` |
| `APP_INSTALLED` | Устанавливается в `true` после установки |

---

## Поддержка и хостинг

Проект разрабатывается при поддержке **[NLTE.cloud](https://nlte.cloud)** — хостинг игровых серверов.

---

## Лицензия

Проект распространяется под лицензией [MIT](LICENSE).  
Основан на [Pelican Panel](https://github.com/pelican-dev/panel) © pelican-dev.

## Ссылки

- [NLTE.cloud](https://nlte.cloud)
- [Pelican Panel (upstream)](https://github.com/pelican-dev/panel)
- [Wings](https://github.com/pelican-dev/wings)

## Supported Games and Servers

Pelican supports a wide variety of games by utilizing Docker containers to isolate each instance.
This gives you the power to run game servers without bloating machines with a host of additional dependencies.

Some of our popular eggs include:

| Category                                                             | Eggs            |               |                    |                |
|----------------------------------------------------------------------|-----------------|---------------|--------------------|----------------|
| [Minecraft](https://github.com/pelican-eggs/minecraft)               | Paper           | Sponge        | Bungeecord         | Waterfall      |
| [SteamCMD](https://github.com/pelican-eggs/steamcmd)                 | 7 Days to Die   | ARK: Survival | Arma 3             | Counter Strike |
|                                                                      | DayZ            | Enshrouded    | Left 4 Dead        | Palworld       |
|                                                                      | Project Zomboid | Satisfactory  | Sons of the Forest | Starbound      |
| [Standalone Games](https://github.com/pelican-eggs/games-standalone) | Among Us        | Factorio      | FTL                | GTA            |
|                                                                      | Kerbal Space    | Mindustry     | Rimworld           | Terraria       |
| [Discord Bots](https://github.com/pelican-eggs/chatbots)             | Redbot          | JMusicBot     | Dynamica           |                |
| [Voice Servers](https://github.com/pelican-eggs/voice)               | Mumble          | Teamspeak     | Lavalink           |                |
| [Software](https://github.com/pelican-eggs/software)                 | Elasticsearch   | Gitea         | Grafana            | RabbitMQ       |
| [Programming](https://github.com/pelican-eggs/generic)               | Node.js         | Python        | Java               | C#             |
| [Databases](https://github.com/pelican-eggs/database)                | Redis           | MariaDB       | PostgreSQL         | MongoDB        |
| [Storage](https://github.com/pelican-eggs/storage)                   | S3              | SFTP Share    |                    |                |
| [Monitoring](https://github.com/pelican-eggs/monitoring)             | Prometheus      | Loki          |                    |                |

## Repository Activity
![Stats](https://repobeats.axiom.co/api/embed/4d8cc7012b325141e6fae9c34a22b3669ad5753b.svg "Repobeats analytics image")

*Copyright Pelican® 2024-2026*
