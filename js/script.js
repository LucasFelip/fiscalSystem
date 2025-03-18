import { formatarCRC } from './formatFields.js';

document.addEventListener("DOMContentLoaded", () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const userNameSpan = document.getElementById("userName");
    const userCrcSpan = document.getElementById("userCrc");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userNameSpan && usuarioLogado) {
        userNameSpan.textContent = usuarioLogado.nomeCompleto;
        userCrcSpan.textContent = formatarCRC(usuarioLogado.crc);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";
        });
    }

    // Cadastro de usuário
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("registerName")?.value.trim();
            const email = document.getElementById("registerEmail")?.value.trim();
            const crc = document.getElementById("registerCRC")?.value.trim();
            const senha = document.getElementById("registerSenha")?.value;

            if (!nome || !email || !senha || !crc) {
                alert("Preencha todos os campos!");
                return;
            }

            if (usuarios.some(user => user.email === email)) {
                alert("E-mail já cadastrado!");
                return;
            }

            const novoUsuario = { nomeCompleto: nome, email, crc, senha };
            usuarios.push(novoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";
        });
    }

    // Login de usuário
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email")?.value.trim();
            const senha = document.getElementById("senha")?.value;

            const usuario = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuario) {
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                window.location.href = "main.html";
            } else {
                alert("E-mail ou senha incorretos!");
            }
        });
    }
});
