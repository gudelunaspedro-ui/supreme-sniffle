# Stack Overflown

**Stack Overflown** é um jogo de quebra-cabeça inspirado em Tetris, com temática de desenvolvimento de software. O jogador organiza os blocos que caem e tenta formar o padrão de erro exibido antes que a pilha alcance o topo.

## Objetivo

- Montar padrões relacionados a erros de programação.
- Acumular pontos e aumentar o nível da partida.
- Evitar que os blocos alcancem o topo da área de jogo.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Canvas API
- LocalStorage

## Estrutura do projeto

```text
.
├── README.md
└── src/
    ├── index.html
    ├── index.js
    ├── patterns.js
    └── style.css
```

### Arquivos principais

- `src/index.html` — interface e elementos visuais do jogo.
- `src/style.css` — estilos, tema visual e responsividade.
- `src/index.js` — movimentação, colisões, pontuação, níveis, pausa e controles.
- `src/patterns.js` — banco de padrões de erros usados como objetivos.

## Como executar

Não há dependências ou instalação obrigatória. Basta abrir `src/index.html` em um navegador moderno.

Também existe um `index.html` na raiz para facilitar a visualização como página estática.

## Controles

| Tecla | Ação |
|---|---|
| `←` / `→` | Mover a peça |
| `↑` | Rotacionar |
| `↓` | Queda acelerada |
| `Espaço` | Queda instantânea |
| `P` | Pausar/continuar |

## Conceitos de Git e GitHub aplicados

Este repositório foi utilizado como aplicação prática dos conceitos estudados na trilha GitHub Foundations. O histórico do projeto inclui:

- commits organizados e descritivos;
- branch de desenvolvimento separada da `main`;
- Pull Request para integrar a alteração;
- merge da branch de desenvolvimento na `main`;
- documentação do projeto neste README.

## Trabalho acadêmico

Projeto desenvolvido para a disciplina **Design Profissional**, como parte da aplicação prática dos conhecimentos de Git e GitHub.

Durante a apresentação, o repositório pode ser usado para demonstrar a evolução do código, a branch de desenvolvimento, o Pull Request, o merge e a documentação do projeto.
