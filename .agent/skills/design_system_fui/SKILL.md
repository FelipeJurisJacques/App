---
name: design_system_fui
description: "Este documento define a estética Cyber-System / FUI (Fictional User Interface) para o desenvolvimento de interfaces Web."
risk: unknown
source: unknown
date_added: "2026-04-01"
---

## Design System FUI

Este documento define a estética **Cyber-System / FUI (Fictional User Interface)** para o desenvolvimento de interfaces Web.

### 1. Paleta de Cores (Croma High-Contrast)
* **Background:** `#000508` (Preto profundo com leve tom azulado).
* **Primary (Action/Info):** `#00F2FF` (Ciano elétrico com `box-shadow` de 5px de brilho).
* **Secondary (Data/Grid):** `rgba(0, 242, 255, 0.3)` (Ciano translúcido).
* **Alert/Critical:** `#FF3B3B` (Vermelho neon para erros ou alertas de sistema).
* **Typography:** `#E0F7FA` (Branco azulado para legibilidade).

### 2. Elementos Gráficos e CSS
* **Bordas:** Usar `clip-path` para criar cantos chanfrados (estilo "militar/tech") em vez de `border-radius` arredondado.
* **Efeito Glassmorfismo:** ```css
    background: rgba(0, 20, 30, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 242, 255, 0.2);
    ```
* **Greebles Digitais:** Adicionar pseudo-elementos (`::before`, `::after`) com pequenas linhas de 2px ou pontos nos cantos das `divs` para simular sensores ou rastreadores.
* **Grids de Fundo:** Usar um padrão de repetição de linhas finas ou pontos (SVG) para dar profundidade ao "espaço" da interface.

### 3. Tipografia (Tech-Spec)
* **Prioridade:** Fontes Monoespaçadas (JetBrains Mono, Fira Code) ou sem serifa geométricas (Rajdhani, Orbitron).
* **Estilo:** `text-transform: uppercase` para labels de sistema e `letter-spacing: 1px`.

### 4. Estrutura de Dados (CSV Integration)
Ao processar arquivos CSV para dashboards:
* **Headers:** Transformar em labels de "System Status".
* **Valores Numéricos:** Renderizar em gráficos de barras horizontais simples ou osciloscópios (Canvas API).
* **CheckSums:** Sempre incluir uma validação visual de integridade dos dados carregados.

### 5. Componentes TSX Sugeridos
* `<SystemBoot />`: Tela de carregamento com log de texto sequencial.
* `<DataCard />`: Painel translúcido com cantos chanfrados e micro-dados nas bordas.
* `<RadialStatus />`: Gráfico circular concêntrico para progresso ou uso de memória.