'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')}




/* =================Crud - Creat Read Update Delete =================*/

/* const tempClient = { //temporário
    nome: "Nickssss",
    email: "pauloVItor@gmail.com",
    celular: '7188323232',
    cidade: "Salvador"
}*/
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] // se for nulo retorna vazio operador ternário
const setLocalStorage = (dbClient) => localStorage.setItem("db_client",JSON.stringify(dbClient)) //leva informações  //json.stringify transforma em string

//create 

const createClient = (client)=>{ 
    const dbClient = getLocalStorage()
    dbClient.push (client) //push add dentro do array (acrescentar mais um)
    setLocalStorage(dbClient)
}

//read 

const readClient = () => getLocalStorage()

//update 

const updateClient = (index, client) =>{
    const dbClient = readClient()
    dbClient[index] = client  
    setLocalStorage(dbClient)
}

//delete

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)
}


/* ================= Interação com HTML =================*/

const isValidFields = () => {
   return document.getElementById("form").reportValidity() // verificar o required
}
const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '') //forEAch vai percorrer o array e vai atribuir vazio 
}
const saveClient = () =>{
    if (isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new'){ 
            createClient(client)
            updateTable()
            closeModal()

        }else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
      
    }  
}
const createRow = (client, index) => { 
    const newRow = document.createElement('tr')
    newRow.innerHTML = ` 
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id='edit-${index}'>Editar</button>
        <button type="button" class="button red" id='delete-${index}'>Excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}
const clearTable= () => { 
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const updateTable = () => { //adicionar os usuarios na tela 
    const dbClient = readClient()
    clearTable() //limpar tabela
    dbClient.forEach(createRow) //criar linha 
}
updateTable()

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome 
    document.getElementById('email').value = client.email 
    document.getElementById('celular').value = client.celular 
    document.getElementById('cidade').value = client.cidade 
    document.getElementById('nome').dataset.index = client.index

}

const editClient = (index) =>{
    const client = readClient()[index]
    client.index = index 
    fillFields(client) //preencher campos
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button'){ // evento click só mostra o botão

        const [ action , index] = event.target.id.split('-')
        //console.log(action , index) // => mostrar qual tipo do botão
        if ( action == 'edit'){       
            editClient(index)           
        }else {
        const client = readClient()[index]
        const response = confirm(`Deseja Realmente Excluir o cliente ${client.nome}`)
        if (response){
            deleteClient(index)
            updateTable()
        }
       
    }
}}


/* ================= EVENTOS =================*/

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal) //abrir Modal

document.getElementById('modalClose')
    .addEventListener('click', closeModal) // fechar modal 

document.getElementById('save')
     .addEventListener('click', saveClient) // salvar client 

document.getElementById('cancel')
    .addEventListener('click',closeModal) // cancelar modal

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete) //editar e deletar