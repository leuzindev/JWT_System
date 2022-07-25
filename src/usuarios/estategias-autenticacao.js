const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./usuarios-modelo');
const BearerStrategy = require('passport-http-bearer') 
const jwt = require('jsonwebtoken');
const { InvalidArgumentError } = require('../erros')
const bcrypt = require('bcrypt');


function verificaUsuario(usuario){
    if(!usuario){
        throw new InvalidArgumentError("Não existe usuario com esse E-mail");
    }
}

async function verificaSenha(senha, senhaHash){
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if(!senhaValida){
        throw new InvalidArgumentError("E-mail ou senha invalidos");
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await Usuario.buscaPorEmail(email)
            verificaUsuario(usuario);
            await verificaSenha(senha, usuario.senhaHash);

            done(null, usuario);
        } catch (error) {
            done(erro);
        }
    })
)

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const payload = jwt.verify(token, process.env.CHAVE_JWT);
                const usuario =  await Usuario.buscaPorId(payload.id);
                done(null, usuario);       
            } catch (error) {
                done(erro);
            }
        }
    )
)