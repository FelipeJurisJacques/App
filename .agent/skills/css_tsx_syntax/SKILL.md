---
name: css-tsx-syntax
description: Regras de sintaxe para implementação de regras CSS diretamente em arquivos TSX e importação de arquivos CSS como strings.
---

# CSS-in-TSX Syntax Skill

Esta skill define como escrever regras CSS diretamente dentro de arquivos TSX (JSX) utilizando o builder `Web`.

## 1. Implementação de CSS em TSX

Para evitar conflitos com as chaves `{}` do JavaScript no TSX, utilize tags HTML dentro de um elemento `<style>`. O builder converterá essas tags em regras CSS.

### Regras de Conversão:
- **Seletor**: O nome da tag, o ID (`id`) e as classes (`class`) formam o seletor CSS.
  - `<div id="main" class="container" />` vira `div#main.container { ... }`
- **Propriedades**: Todos os outros atributos da tag são convertidos em propriedades CSS.
  - `<div color="red" font-size="20px" />` vira `color: red; font-size: 20px;`
- **Nesting**: Tags aninhadas dentro de outras tags geram regras CSS aninhadas.
  - `<div class="parent"><span color="blue" /></div>` vira:
    ```css
    div.parent {
        span {
            color: blue;
        }
    }
    ```

### Exemplo de Uso:
```tsx
const MyComponent = () => (
    <div class="wrapper">
        <style>
            <div class="wrapper" display="flex" padding="20px">
                <h1 font-size="2rem" color="var(--primary)" />
                <p margin-top="10px" color="#666" />
            </div>
        </style>
        <h1>Título</h1>
        <p>Conteúdo</p>
    </div>
);
```

## 2. Importação de Arquivos CSS

Arquivos `.css` podem ser importados diretamente em arquivos TypeScript/TSX e serão tratados como strings. Isso é útil para utilizar com `CSSStyleSheet.replace()` ou injetar em Shadow Roots.

### Exemplo:
```typescript
import Stylesheet from './main.css';

// O 'Stylesheet' é uma string contendo o conteúdo do arquivo CSS.
const sheet = new CSSStyleSheet();
sheet.replace(Stylesheet);
```

### Configuração:
Esta funcionalidade é suportada pelo módulo `Web.ts` que declara:
```typescript
declare module '*.css' {
    const content: string
    export default content
}
```
