import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

async function handleFiles(directory: string, handler: (file: string) => void): void {
    const entries = await fs.readdir(directory, {
        withFileTypes: true,
    })
    for (const entry of entries) {
        const path = path.join(directory, entry.name)
        const fullPath = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            handleFiles(path, handler)
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            handler(path)
        }
    }
}

const start = Date.now()

try {
    console.log('Compilando projeto em desenvolvimento...')
    const output = execSync('npx tsc').toString()
    console.log(output)
} catch (error) {
    console.error('Falha ao compilar type script.')
}

handleFiles('/workspace/.build/', file => {
    console.log(file)
})

// // Converte o conteúdo de um arquivo CommonJS para ESM (versão simplificada)
// function convertCode(code: string): string {
//     let converted = code;

//     // 1. Ajusta caminhos relativos em require ou import
//     //    Ex: require('./foo') → require('./foo.mjs')
//     //    Ex: import('./foo')  → import('./foo.mjs')
//     converted = converted.replace(
//         /(require|import)\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
//         (match, keyword, modulePath) => {
//             if (modulePath.startsWith('.')) {
//                 // Se não tiver extensão, adiciona .mjs
//                 const ext = path.extname(modulePath);
//                 if (!ext) {
//                     return `${keyword}('${modulePath}.mjs')`;
//                 }
//             }
//             return match;
//         }
//     );

//     // 2. Converte require('modulo') para import (caso mais simples)
//     //    Atenção: isso não cobre todos os casos (ex: require com desestruturação).
//     //    Para projetos simples, é um bom começo.
//     //    Vamos transformar:
//     //      const x = require('modulo')  →  import x from 'modulo'
//     //      const { a, b } = require('modulo') → import { a, b } from 'modulo'
//     //    Mas como isso é complexo com regex, vamos adotar uma abordagem mais segura:
//     //    Substituir apenas require('...') por import('...') dinâmico (mantém compatibilidade).
//     //    Ou usamos uma abordagem mais simples: trocar require() por import() dinâmico.
//     //    O ideal é usar AST, mas para simplificar, faremos:
//     converted = converted.replace(
//         /const\s+(\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
//         (match, varName, modulePath) => {
//             // Se o caminho for relativo, já ajustamos a extensão anteriormente
//             return `import ${varName} from '${modulePath}'`;
//         }
//     );

//     // Também cobre: const { x } = require('...')
//     converted = converted.replace(
//         /const\s*\{\s*([^}]+)\s*\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
//         (match, imports, modulePath) => {
//             return `import { ${imports.trim()} } from '${modulePath}'`;
//         }
//     );

//     // 3. Converte module.exports = ...  → export default ...
//     converted = converted.replace(
//         /module\.exports\s*=\s*([^;]+);?/g,
//         (match, exportExpr) => `export default ${exportExpr.trim()};`
//     );

//     // 4. Converte exports.nome = ...  → export const nome = ...
//     converted = converted.replace(
//         /exports\.(\w+)\s*=\s*([^;]+);?/g,
//         (match, name, value) => `export const ${name} = ${value.trim()};`
//     );

//     // 5. (Opcional) Remove 'use strict' pois ESM já é strict por padrão
//     converted = converted.replace(/['"]use strict['"];?\s*/, '');

//     return converted;
// }

// // ========== FUNÇÃO PRINCIPAL ==========
// async function main() {
//     // Cria diretório destino se não existir
//     await fs.mkdir(TARGET_DIR, { recursive: true });

//     // Encontra todos os arquivos .js no diretório fonte
//     const jsFiles = await getJSFiles(SOURCE_DIR);

//     for (const sourcePath of jsFiles) {
//         // Caminho relativo a partir do SOURCE_DIR
//         const relativePath = path.relative(SOURCE_DIR, sourcePath);
//         // Substitui extensão .js → .mjs
//         const targetPath = path.join(TARGET_DIR, relativePath.replace(/\.js$/, '.mjs'));

//         // Lê o conteúdo original
//         const code = await fs.readFile(sourcePath, 'utf-8');

//         // Converte
//         const converted = convertCode(code);

//         // Garante que o diretório de destino exista
//         await fs.mkdir(path.dirname(targetPath), { recursive: true });

//         // Salva o arquivo convertido
//         await fs.writeFile(targetPath, converted, 'utf-8');

//         console.log(`✅ Convertido: ${relativePath} → ${path.relative('.', targetPath)}`);
//     }

//     console.log('\n🎉 Conversão concluída!');
// }

const end = Date.now()
const diff = (end - start) / 1000
console.log(`Execussão em ${diff} segundos`)