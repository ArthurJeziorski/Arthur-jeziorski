import promptSync from 'prompt-sync'
import client from "./database/db.js"

const prompt = promptSync({ sigint: true })

async function consultProducts() {
    try {
        const items = await client.query("SELECT id, name, amount FROM products")
        if (items.rowCount == 0) {
            console.log("\nSem produtos cadastrados no momento.")
            return
        }
        
        items.rows.forEach(item => {
            console.log(`[${item.id}] ${item.name}`);
            console.log(`Estoque: ${item.amount}\n`)
        });
        console.log(`Total de itens: ${items.rowCount}`);
    } catch (err) {
        console.log("Erro ao buscar dados.")
    }
}

async function main() {
    console.log("Almoxarifado do seu Zé")
    const user = prompt("Digite seu usuário: ")
    const password = prompt("Digite sua senha: ")
    if (!user || !password) {
        console.log("Usuário ou senha inválido.")
        return
    }

    let role
    await client.connect()
    try {
        const userDb = await client.query(`SELECT role FROM users WHERE name = $1 AND password = $2`, [user, password])
        if (userDb.rowCount == 0) {
            console.log("Usuário ou senha inválido.")
            return await client.end()
        }
        role = userDb.rows[0]['role']
    } catch (err) {
        console.log("Erro ao buscar dados.")
        return await client.end()
    }

    let running = true
    while (running) {
        console.log(`\n${user} — ${role}\nSeja bem vindo! Escolha uma opção: \n`)
        if (role == "ADMIN") {
            console.log("1 - Cadastrar Usuários")
            console.log("2 - Atualizar Usuário")
            console.log("3 - Apagar Usuário")
            console.log("4 - Consultar Produtos")
            console.log("5 - Cadastrar Produtos")
            console.log("6 - Atualizar Produtos")
            console.log("7 - Apagar Produtos")
            console.log("8 - Auditoria (Logs)")
            console.log("9 - Sair")
        } else {
            console.log("1 - Consultar Produtos")
            console.log("2 - Cadastrar Produtos")
            console.log("3 - Atualizar Produtos")
            console.log("4 - Sair")
        }

        const option = prompt("\n: ")
        if (role == "ADMIN") {
            switch (option) {
                case 9: running = false; break
            }
        } else {
            try {
                 switch (option) {
                    case '1': await consultProducts(); break
                    case '4': running = false; break
                    default:
                        console.log('Opção inválida. Tente novamente.');
                }
            } finally {
                await client.end()
            }
        }
    }
}

main()