// ===== NUTRI KIDS - LOGIN E CADASTRO =====

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const pageTitle = document.title;

    // Verificar se é página de login ou cadastro
    const isLoginPage = pageTitle.includes("Login");
    const isCadastroPage = pageTitle.includes("Cadastro");

    if (isLoginPage) {
        setupLogin(form);
    } else if (isCadastroPage) {
        setupCadastro(form);
    } else {
        // Fallback: tentar detectar por ID do formulário
        const cadastroForm = document.getElementById('cadastro-form');
        const loginForm = document.getElementById('login-form');
        
        if (cadastroForm) {
            setupCadastro(cadastroForm);
        } else if (loginForm) {
            setupLogin(loginForm);
        }
    }
});

// ===== FUNCIONALIDADE DE LOGIN =====
function setupLogin(form) {
    if (!form) {
        console.error('Formulário de login não encontrado!');
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email")?.value?.trim();
        const senha = document.getElementById("senha")?.value?.trim();

        // Validação de campos
        if (!email || !senha) {
            alert(" Por favor, preencha o e-mail e a senha.");
            return;
        }

        // Validação de email
        if (!email.includes('@')) {
            alert(" Por favor, insira um email válido!");
            return;
        }

        try {
            console.log("📤 Enviando dados de login:", { email, senha });
            
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: senha }),
            });

            const data = await response.json();
            console.log(" Resposta do servidor:", data);

            if (!data.success) {
                alert(" " + (data.message || "Email ou senha incorretos."));
                return;
            }

            // Sucesso: salvar dados do usuário e redirecionar
            localStorage.setItem("usuarioLogado", JSON.stringify(data.user));
            alert(" Login realizado com sucesso!");
            window.location.href = "feed.html";

        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert(" Erro ao conectar com o servidor. Verifique se o servidor está rodando na porta 3000.");
        }
    });
}

// ===== FUNCIONALIDADE DE CADASTRO =====
function setupCadastro(form) {
    if (!form) {
        console.error('Formulário de cadastro não encontrado!');
        return;
    }
    
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const nome = document.getElementById("nome")?.value?.trim();
        const email = document.getElementById("email")?.value?.trim();
        const senha = document.getElementById("senha")?.value?.trim();

        if (!nome || !email || !senha) {
            alert(" Por favor, preencha todos os campos!");
            return;
        }

        // Validação básica de email
        if (!email.includes('@')) {
            alert(" Por favor, insira um email válido!");
            return;
        }

        // Validação de senha (mínimo 6 caracteres)
        if (senha.length < 6) {
            alert(" A senha deve ter pelo menos 6 caracteres!");
            return;
        }

        const cadastro = { name: nome, email, password: senha };

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cadastro),
            });

            const data = await response.json();

            if (data.success) {
                alert(" Cadastro realizado com sucesso! Redirecionando para o login...");
                window.location.href = "login.html";
            } else {
                alert(" Erro no cadastro: " + (data.message || "Tente novamente"));
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert(" Erro ao conectar com o servidor. Verifique se o servidor está rodando na porta 3000.");
        }
    });
}