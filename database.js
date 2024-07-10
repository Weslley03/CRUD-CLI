const {
    readFile,
    writeFile
} = require('fs')

const { 
    promisify       
} = require('util')

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

class Database {
    constructor(){
        this.NOME_ARQUIV = 'user.json'
    }

    async obterDadosArquivo(){
        const arquivo = await readFileAsync(this.NOME_ARQUIV, 'utf8')
        return JSON.parse(arquivo.toString())
    }   

    async escreverArquivo(dados){
        await writeFileAsync(this.NOME_ARQUIV, JSON.stringify(dados))
        return true
    }

    async cadastrar(user){
        const dados = await this.obterDadosArquivo()
        const id = user.id <= 2 ? user.id : Date.now()
        
        const userComId = {
            id,
            ...user
        }

        const dadosFinal = [
            ...dados,
            userComId
        ]
        
        const resultado = await this.escreverArquivo(dadosFinal)
        return resultado
    }

    async listar(id){
        const dados = await this.obterDadosArquivo()
        const dadosFiltrados = dados.filter(item => (id ? (item.id === id) : true))
        return dadosFiltrados
    }

    async remover(id){
        if(!id){
            return await this.escreverArquivo([])
        }

        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if(indice === -1) {
            throw Error('o seu user não existe') 
        }
        dados.splice(indice -1)
        return await this.escreverArquivo(dados)
    }

    async atualizar(id, modifications){
        const dados = await this.obterDadosArquivo()
        const indice = dados.findIndex(item => item.id === parseInt(id))
        if(indice === -1){
            throw Error('user informado não existe')
        }
        const atual = dados[indice]

        const objetoAtualizar = {
            ...atual,
            ...modifications
        }
        dados.splice(indice, 1)
        
        return await this.escreverArquivo([
            ...dados,
            objetoAtualizar
        ])

    }
}

module.exports = new Database()