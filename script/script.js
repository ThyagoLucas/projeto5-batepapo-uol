// Global variables//

let nameUser = null;
let updates = 0;

let lastObj= null;

let msgType = 'message';  //default
let userToSend = 'todos'; //default


//-----Request section------//


//login
function loginAuthentication(){

    const inputName = document.querySelector(".user").value;
    const user = {
        name: inputName
      }
   
      nameUser = user;

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promisse.then(loginSucess);
    promisse.catch(loginFail);

}
function loginSucess(response){
    getMessage();
    getParticipants();
    imOnline();
    
}
function loginFail(response){
    alert("Usuario já logado, tente com outro nome");
 
}
function imOnline(){

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", nameUser);
    
        setTimeout(imOnline, 5000);
        
        console.log("ainda to aqui");   
}


//get and post messages

function getMessage(){

    const messagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagens.then(refreshMsg);
    messagens.catch(failGetMessage);
    setTimeout(getMessage, 3000);

}

function refreshMsg(chatMsgs){

    //seta a primeira posição do array principal, logo ela tbm será a ultima;
    if(updates == 0) {
        let findFirst = false;
        let i = 99;
        while(findFirst == false){
            
            let usuario = chatMsgs.data[i];

            if(nameUser.name == usuario.from){

                lastObj = usuario;
                updates++;
                   

                writeMessages(updates, lastObj);
                const entrou = document.querySelector(".tela-login");
                entrou.classList.add("disabled");

                findFirst=true; 
                
            
            }
            i--;
        
        }

    }else{
        //Seta as ultimas msgs verificando o array que chegou, de tras para frente;
        for(let i = 99; i>=0; i--){
         
            let user = chatMsgs.data[i];
            
            if((user.from == lastObj.from) && (user.time == lastObj.time)){
                
                for(let j = i  ; j <=98; j++){

                    
                    lastObj = chatMsgs.data[j+1];  

                    updates++;

                    writeMessages(updates, lastObj);
                
                }
                break;
            }
        }     
    }

}

function failGetMessage(response){
   // alert("Falha ao recarregar msgs, recarregue a pagagina");
}

function writeMessages(number, toPrint){
    const main = document.querySelector(".messages");


    if(toPrint.type == 'status'){
        main.innerHTML += `
        <p class=" ${toPrint.type} a${number}"><span> (${toPrint.time})</span>
        <strong> ${toPrint.from} </strong> ${toPrint.text}</p>  
        `
        scroll();

    }if(toPrint.type == 'message'){
        main.innerHTML += `
        <p class=" ${toPrint.type} a${number}"><span> (${toPrint.time})</span>
        <strong> ${toPrint.from} </strong> para <strong>${toPrint.to}:
        </strong> ${toPrint.text}</p>
    `
        scroll();

    }if((toPrint.type == 'private_message') && (toPrint.to == nameUser)){
        main.innerHTML += `<p class=" ${toPrint.type} a${number}"><span class="hora">${toPrint.time}</span>
        <span class="nome">${toPrint.from}</span> ${toPrint.text}</p>
    `   
        scroll();

    }
    function scroll (){
        const scroll = document.querySelector(`.a${updates}`);
        scroll.scrollIntoView();

    }

 

}

function sendMsg(){
    const message = document.querySelector(".send-msg").value;
    const textMsg = {
        from: nameUser.name,
        to: userToSend,
        text: message,
        type: msgType
        
    }
    

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", textMsg);                                                                                                                                                                                                                                                                                                     
    getMessage();

    const refreshFooter = document.querySelector(".footer");
    refreshFooter.innerHTML = `
    <input class="send-msg" type="text" placeholder="Escreva sua msg aqui">
    <ion-icon class="icon" name="paper-plane-outline" onclick="sendMsg()"></ion-icon>
    `




}


//participants and sidbar

function getParticipants(){
    const messagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    messagens.then(refreshParticipants);
   // make anonimos function messagens.catch();
    setTimeout(getParticipants, 10000);
}


function refreshParticipants(response){

    const onlines = document.querySelector(".onlines");
    onlines.innerHTML =  `${response.data.length} pessoas onlines`
    const name = document.querySelector(".section");
    name.innerHTML = `
    <button class="option" value="allPeoples"  
    onclick="selectUser(this)">
    <ion-icon name="people"></ion-icon>
    Todos</button>
    `

    for(let i = 0; i< response.data.length; i++){

        let user =  response.data[i];
        name.innerHTML +=`
        <button class="option" onclick="selectUser('${user.name}')"> 
        <ion-icon name="person"></ion-icon>${user.name}</button>
        `
    }
    

}

function selectUser(userSelected){
    userToSend = userSelected;


}
function selectType(userSelected){



}







function onOffSidbar(){

    const desativa = document.querySelector(".sidbar");
    desativa.classList.toggle("disabled");


}