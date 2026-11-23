# Pomodoro Timer — extensão para Chrome

Timer Pomodoro (25 minutos) para o Chrome, feito com React + TypeScript e Manifest V3.
*A 25-minute Pomodoro timer for Chrome, built with React, TypeScript and Manifest V3.*

## O que faz / Features

- Iniciar, pausar e zerar o timer pelo popup da extensão. / Start, pause and reset from the toolbar popup.
- O timer continua contando com o popup fechado e mesmo se o Chrome suspender o service worker. / Keeps running with the popup closed, even when Chrome suspends the service worker.
- Notificação do sistema quando a sessão termina. / System notification when the session ends.

### Como funciona / How it works

O estado salvo é o **horário de término** (`endAt`), não um contador que decrementa a cada segundo. O popup só calcula `endAt - agora` para exibir, e um `chrome.alarms` agendado para `endAt` acorda o service worker para disparar a notificação. Isso é necessário porque no Manifest V3 o service worker é encerrado após ~30 s ocioso, e um `setTimeout` morre junto com ele. A lógica pura está em [`src/timer.ts`](src/timer.ts), com testes em [`src/timer.test.ts`](src/timer.test.ts).

*State is stored as a deadline; `chrome.alarms` wakes the service worker at that deadline to notify, because MV3 service workers are killed when idle and plain timers die with them.*

## Permissões / Permissions

| Permissão | Por quê / Why |
|---|---|
| `alarms` | Agendar o fim da sessão de forma que sobreviva à suspensão do service worker. / Schedule the end of the session reliably. |
| `notifications` | Avisar quando o tempo acaba. / Notify when time is up. |
| `storage` | Guardar o estado do timer (local, no próprio navegador). / Persist timer state locally. |

Sem `host_permissions`, sem content scripts, sem acesso a abas ou sites, sem código remoto. A CSP das páginas da extensão é `script-src 'self'; object-src 'self'`.
*No host permissions, no content scripts, no tab/site access, no remote code.*

## Rodando localmente / Running locally

Requer Node.js 22.12+ / Requires Node.js 22.12+.

```bash
git clone https://github.com/ogatalars/extension-pomodoro.git
cd extension-pomodoro
npm ci
npm run build   # gera a pasta build/
npm test
```

### Carregar no Chrome / Load unpacked

1. Abra `chrome://extensions/`. / Open `chrome://extensions/`.
2. Ative o **Modo do desenvolvedor** (canto superior direito). / Enable **Developer mode**.
3. Clique em **Carregar sem compactação** e selecione a pasta `build/`. / Click **Load unpacked** and pick the `build/` folder.

## CI

O GitHub Actions roda build (com checagem de tipos), testes e `npm audit --audit-level=high` em cada push e pull request.
*GitHub Actions runs type-checked build, tests and `npm audit --audit-level=high` on every push and PR.*
