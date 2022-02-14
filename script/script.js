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
  // alert("Falha ao recarregar msgs, recarregue a página");
  // window.location.reload()
}

function writeMessages(number, toPrint){
    const main = document.querySelector(".messages");

    if(toPrint.type == 'status'){
        main.innerHTML += `
        <div data-identifier="message" class="msgR  ${toPrint.type} a${number}"><span> (${toPrint.time})</span>
        <strong> ${toPrint.from} </strong> ${toPrint.text}</div>  
        `
        scroll();

    }if(toPrint.type == 'message'){
        main.innerHTML += `
        <div data-identifier="message" class="msgR ${toPrint.type} a${number}"><span> (${toPrint.time})</span>
        <strong> ${toPrint.from} </strong> para <strong>${toPrint.to}:
        </strong> ${toPrint.text}</div>
    `
        scroll();

    }if((toPrint.type == 'private_message') && ((toPrint.from == nameUser.name)||(toPrint.to == nameUser.name))){
        main.innerHTML += `
        <div data-identifier="message" class="msgR private a${number}"><span>(${toPrint.time})</span>
        <strong> ${toPrint.from} </strong> para <strong>${toPrint.to}:
        </strong> ${toPrint.text}</div>
    
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
        type: msgType,
        
    }
    

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", textMsg);                                                                                                                                                                                                                                                                                                     
    getMessage();

    const refreshFooter = document.querySelector(".footer");
    refreshFooter.innerHTML = `
    <input class="send-msg" type="text" placeholder="Escreva sua msg aqui">
    <ion-icon data-identifier="send-message" class="icon" name="paper-plane-outline" onclick="sendMsg()"></ion-icon>
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
    <div class="option todos check" 
    onclick="selectUser('todos')">
    <ion-icon name="people"></ion-icon>
    Todos
    <ion-icon class="icone" name="checkmark-sharp"></ion-icon>
    </div>
    `

    for(let i = 0; i< response.data.length; i++){
        
        let user =  response.data[i];
        name.innerHTML +=`
        <div class="option ${user.name}" onclick="selectUser('${user.name}')"> 
            <ion-icon name="person"></ion-icon>${user.name} 
            <ion-icon class="icone" name="checkmark-sharp"></ion-icon> 
        </div>
        `
       
    }
    

}

function selectUser(userSelected){

    const verifyCheck = document.querySelector(`.option.${userToSend}.check`);

    if(verifyCheck != null){
    verifyCheck.classList.remove("check");
    }
    
    const toggleCheck = document.querySelector("."+userSelected);
    toggleCheck.classList.add("check");


    userToSend = userSelected;



}

function selectType(typeSelected){
    
    const verifyCheck = document.querySelector(`.option.${msgType}.check`);

    if(verifyCheck != null){
    verifyCheck.classList.remove("check");
    }
    
    const toggleCheck = document.querySelector("."+typeSelected);
    toggleCheck.classList.add("check");


    msgType = typeSelected;



}







function onOffSidbar(){

    const desativa = document.querySelector(".sidbar");
    desativa.classList.toggle("disabled");


}