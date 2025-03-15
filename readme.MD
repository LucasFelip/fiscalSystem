# Sistema de Cálculo de Imposto de Renda

## 📌 Visão Geral
Este projeto é um sistema web para cálculo de Imposto de Renda, permitindo diferentes modalidades de cálculos, incluindo honorários, IR sobre RRA, FEPA e IRPJ. O sistema permite que os usuários façam login, preencham formulários dinâmicos e gerem relatórios em PDF com os resultados dos cálculos.

## 🛠️ Tecnologias Utilizadas
- **HTML5** e **CSS3** para estrutura e estilo.
- **Bootstrap 5.3** para estilização responsiva.
- **JavaScript (ES6+)** para manipulação dinâmica da interface.
- **IMask.js** para formatação de campos.
- **jsPDF** para geração de relatórios em PDF.
- **bcryptjs** para simulação de criptografia de senhas.
- **LocalStorage** para armazenamento de usuários e sessão.

## 📂 Estrutura do Projeto
```
📁 projeto-calculo-IR
│── 📁 css
│   └── style.css
│── 📁 js
│   ├── calculoIR.js
│   ├── dynamicForm.js
│   ├── formatFields.js
│   ├── geradorPDF.js
│   ├── IR_FEPA.js
│   ├── IR_Honorarios.js
│   ├── IR_PJ.js
│   ├── IR_RRA.js
│   ├── script.js
│── index.html
│── main.html
│── register.html
└── README.md
```

## 🔹 Funcionalidades
### 🔑 **Autenticação de Usuário**
- Cadastro de usuário com **nome, e-mail, CRC e senha**.
- Login de usuário via formulário.
- Armazena os dados no `localStorage`.
- Redirecionamento para a página principal após login.

### 📋 **Formulário Dinâmico**
- O formulário se adapta de acordo com o **tipo de IR** selecionado.
- Tipos de cálculos disponíveis:
    - **Honorários Advocatícios**
    - **IR e FEPA**
    - **Imposto de Renda sobre RRA**
    - **Imposto de Renda Pessoa Jurídica (IRPJ)**

### 📊 **Cálculo do Imposto de Renda**
Cada tipo de imposto possui um cálculo específico, implementado nos arquivos correspondentes:
- **Honorários** (`IR_Honorarios.js`) - Aplica a tabela progressiva do IR.
- **FEPA** (`IR_FEPA.js`) - Considera alíquotas históricas de contribuição.
- **RRA** (`IR_RRA.js`) - Cálculo baseado na quantidade de meses acumulados.
- **IRPJ** (`IR_PJ.js`) - Cálculo com alíquotas diferenciadas para empresas optantes ou não pelo Simples Nacional.

### 📝 **Geração de PDF**
- Após o cálculo, um relatório em **PDF** é gerado automaticamente.
- O relatório inclui:
    - **Dados do processo** (número, partes envolvidas).
    - **Valores do cálculo**.
    - **Assinatura digital baseada no usuário logado**.

## ⚙️ Como Executar o Projeto
### 🖥️ **Rodando Localmente**
1. Faça o download ou clone este repositório.
   ```sh
   git clone https://github.com/LucasFelip/fiscalSystem.git
   ```
2. Abra o arquivo `index.html` em um navegador web.

## 📝 Licença
Este projeto foi desenvolvido como uma **prova de conceito** (MVP) e não possui licença específica para uso comercial ou distribuição.

