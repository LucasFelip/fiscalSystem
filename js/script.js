// Simulando um "banco de dados" no localStorage
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const userNameSpan = document.getElementById("userName");
    const userCrcSpan = document.getElementById("userCrc");
    const logoutBtn = document.getElementById("logoutBtn");
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Verifica se o usuário está logado na main.html
    if (userNameSpan && usuarioLogado) {
        userNameSpan.textContent = usuarioLogado.nomeCompleto;
        userCrcSpan.textContent = usuarioLogado.crc;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";
        });
    }

    // ✅ Cadastro de usuário
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const crc = document.getElementById("registerCRC").value;
            const senha = document.getElementById("registerSenha").value;

            if (!nome || !email || !senha || !crc) {
                alert("Preencha todos os campos!");
                return;
            }

            if (usuarios.some(user => user.email === email)) {
                alert("E-mail já cadastrado!");
                return;
            }

            console.log("Processando cadastro..."); // Debug

            const novoUsuario = { nomeCompleto: nome, email, crc: crc, senha: senha };
            usuarios.push(novoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "index.html";
        });
    }

    // ✅ Login de usuário
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            const usuario = usuarios.find(user => user.email === email);

            if (usuario) {
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
                window.location.href = "main.html";
            } else {
                alert("E-mail ou senha incorretos!");
            }
        });
    }
});
