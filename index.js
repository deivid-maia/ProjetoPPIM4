
//MÓDULO 4

// exibir a daata do último acesso (cookies)
// autenticar o usuário para controlar o acesso aos recursos da aplicação

import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path'; //lidar com as urls 
import session from 'express-session';

const porta = 3000;
const host = '0.0.0.0';
var listaUsuarios = [];

function processaCadastroUsuario(requisicao, resposta){
    //extrair os dados do corpo da requisição, além de validar os dados

    const dados = requisicao.body;
    let conteudoResposta = '';
    // é necessário validar os dados enviados
    // a validação dos dados é de responsabilidade da aplicação servidora
    if (!(dados.nome && dados.telefone && dados.email && dados.senha
    && dados.confirmarSenha)){
        //estão faltando dados do usuário
        conteudoResposta = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Formulário de Inscrição</title>
            <link rel="stylesheet" href="estilo.css">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <form action='/cadastroUsuario' method="POST">
                    <fieldset>
                        <h2>Formulário de Inscrição</h2>
                        <div class="form-group">
                            <label for="nome">Nome</label>
                            <input type="text" id="nome" name="nome" value="${dados.nome}">
                        </div>
        `;

        if(!dados.nome){
            conteudoResposta += `
                    <div>
                        <p class="text-danger">Por favor, informe o nome !</p>
                    </div>`;
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="tel" id="telefone" name="telefone" value="${dados.telefone}">
                    </div> `;
        if(!dados.telefone){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe o telefone !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" value="${dados.email}">
                    </div>`;
        if(!dados.email){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe o e-mail !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                         <label for="senha">Senha</label>
                        <input type="password" id="senha" name="senha" value="${dados.senha}">
                    </div>`;
        if(!dados.senha){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, informe a senha !</p>
                    </div>`;
              
        }

        conteudoResposta +=`
                    <div class="form-group">
                        <label for="confirmar-senha">Confirmar Senha</label>
                        <input type="password" id="confirmarSenha" name="confirmarSenha" value="${dados.confirmarSenha}">
                    </div>`;
        if(!dados.confirmarSenha){
            conteudoResposta +=`
                    <div>
                        <p class="text-danger">Por favor, confirme a senha !</p>
                    </div>`;
              
        }

        conteudoResposta += `
                    <button type="submit">Inscrever-se</button>
                            
                        </fieldset>
                    </form>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous"></script>
            </body>
            </html>`; 

        resposta.end(conteudoResposta);
        
    }
    else{

    const usuario = {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        senha: dados.senha,
        confirmarSenha: dados.confirmarSenha
    }

    //adiciona um novo usuario na lista de usuarios já cadastrados
    listaUsuarios.push(usuario);
    //retornar a lista de usuarios
    let conteudoResposta = `
    <!DOCTYPE html>
    <head>
        <meta charset="UTF-8">
        <title> Menu do sistema </title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    </head>
    <body>
        <h1>Lista de usuários cadastrados</h1>
        <table class="table table-dark table-hover">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Senha</th>
                    <th>Confirmar senha</th>
                </tr>
            </thead>
            <tbody>`;
            
    for(const usuario of listaUsuarios){
         conteudoResposta += `
                        <tr>
                            <td>${usuario.nome}</td>
                            <td>${usuario.telefone}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.senha}</td>
                            <td>${usuario.confirmarSenha}</td>
                        </tr>
                    
                    `;
    }
 
    conteudoResposta += `
             </tbody>
        </table>
        <a class="btn btn-primary" href="/" role="button">Voltar ao menu</a>
        <a class="btn btn-primary" href="/cadastroUsuario.html" role="button">Continuar cadastrando</a>
    </body>
    </html> `;
        resposta.end(conteudoResposta);
    } // final do if/else de validação
}                    

const app = express();


function autenticar(requisicao, resposta, next){
    if(requisicao.session.usuarioAutenticado){
        next();
    }
    else{
        resposta.redirect("/login.html")
    }
}

// ATIVANDO A CAPACIDADE DE MANIPULAR COOKIES
app.use(cookieParser());

//ATIVAR UMA NOVA CAPACIDADE PARA ESSA APLICAÇÃO >>>> MEMORIZAR OS DADOS COM QUEM O SERVIDOR ESTÁ SE COMUNICANDO
//DURANTE O USO DO SISTEMA , A APLICAÇÃO SABERÁ, DENTRO DE UMA SESSÃO VÁLIDA, COM QUEM ELA SE COMUNICA
app.use(session({
    secret:"$enh@d4$e$$!0n",
    resave: true, // atualiza a sessão, mesmo que não tenha alterações a cada requisição
    saveUninitialized: true,
    cookie: {
        //tempo de vida da sessão
        maxAge: 1000 * 60 * 15 // 15 minutos
    }

}))

// ativar a extensão que manipula requisicoes HTTP
//opcao false ativa a extensão
// opcap true ativa a extensão qs(manipula objetos(lista, aninhados))
app.use(express.urlencoded({extended: true}));

//indicando para a aplicação como servir arquivos estáticos localizados na pasta 'paginas'
app.use(express.static(path.join(process.cwd(),'paginas'))); // junto com a biblioteca path, faz a correção da localização da pasta pro deploy no vercel

//endpoint login que irá processar o loggin da aplicação
app.post('/login',(requisicao, resposta) =>{
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario && senha && (usuario === 'deivid') && (senha ==='112233')){
        requisicao.session.usuarioAutenticado = true;
        requisicao.session.nomeUsuario = usuario;
        resposta.redirect('/');
    }
    else{
        resposta.end(`
            <!DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <title>Falha na autenticação</title>
                </head>
                <body>
                    <h3>Usuário ou senha inválidos !</h3>
                    <a href="/login.html">Voltar a tela de login</a>
                </body>
            </html>
        `);
    }
}

)


app.get('/', autenticar, (requisicao, resposta) => {

    const nomeUsuario = requisicao.session.nomeUsuario;
    const DataUltimoAcesso = requisicao.cookies.DataUltimoAcesso;

    const data = new Date();
    resposta.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000*60*60*24*30,
        httpOnly: true
    });

    resposta.end(`
        <!DOCTYPE html>
            <head>
                <meta charset="UTF-8">
                <title> Menu do sistema </title>
            </head>
            <body>
                <h1> MENU </h1>
                <ul>
                    <li> <a href="/cadastroUsuario.html"> Cadastrar Usuário </a> </li>
                </ul>
            </body>
            <footer>
                <p>Olá <strong>${nomeUsuario}</strong> ! Seu último acesso nessa página foi em ${DataUltimoAcesso}</p>
            </footer>
        </html>
        
    `);
})



//rota para processar o cadastro de usuarios endpoint = '/cadastroUsuario'
app.post('/cadastroUsuario',autenticar, processaCadastroUsuario);


app.listen(porta, host, () => {
    console.log(`Servidor executando na url http://${host}:${porta}`);

});
