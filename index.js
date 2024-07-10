const { Command } = require('commander')
const database = require('./database.js')
const User = require('./user.js')

async function main(){
    const program = new Command()
     
    program
    .version('v1')
    .option('-n, --nome [value]', 'nome do usuario')
    .option('-p, --cpf [value]', 'cpf do usuario')
    .option('i, --id [value]', 'id do usuario')

    .option('-c, --cadastrar', 'cadastrar um usuario')
    .option('-l, --listar', 'listar os usuarios em arquivo')
    .option('-r, --remover', 'remove um usuario por id')
    .option('-a, --atualizar [value]', 'atualiza usuario pelo id')
    .parse(process.argv)
 
    const options = program.opts()
    const user = new User(options)

    try{
        if(options.cadastrar){
            delete user.id
            const resultado = await database.cadastrar(user)
            if(!resultado){
                console.err('o user não foi cadastrado')
                return
            }
            console.log('user cadastrado com sucesso!')
        }

        if(options.listar){
            const resultado = await database.listar()
            console.log(resultado)
            return
        }

        if(options.remover){
            const resultado = await database.remover(user.id)
            if(!resultado){
                console.error('não foi possivel remover o user')
                return
            }
            console.log('user removido com sucesso!')
        }

        if(options.atualizar){
            const idParaAtualizar = parseInt(options.atualizar)
            delete user.id
            //remover todas as chaves que estiveram undefined | null
            const dado = JSON.stringify(user)
            const userAtualizar = JSON.parse(dado)
            const resultado = await database.atualizar(idParaAtualizar, userAtualizar)
            if(!resultado){
                console.error('não possivel atualizar o user')
                return
            }
            console.log('user atualizado com sucesso!')
        }

    }catch(err){
        console.error('DEU RUIM', err)
    }
}

main()