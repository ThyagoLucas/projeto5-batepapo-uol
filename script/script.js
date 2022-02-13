// Global variables//

let nameUser = null;
let mainArray = [];
let lastObj= null;
let lastIndex = 0;
let ultimo = "a"+lastIndex;


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
    if(mainArray.length == 0) {
        let findFirst = false;
        let i = 0 ;
        while(findFirst == false){
            
            let usuario = chatMsgs.data[i];

            if(nameUser.name == usuario.from){
                
                mainArray[lastIndex] = chatMsgs.data[i];
                lastObj = chatMsgs.data[i];
                findFirst == true;
                ultimo = "a"+lastIndex;
                lastIndex++;
                writeMessages(ultimo, usuario);
                const entrou = document.querySelector(".tela-login");
                entrou.classList.add("disabled");
            }

            i++;
        }

    }else{
        //Seta as ultimas msgs verificando o array que chegou, de tras para frente;
        for(let i = 99; i>=0; i--){
         
            let usuario = chatMsgs.data[i];
            
            if((usuario.from == lastObj.from) && (usuario.time == lastObj.time)){
                
                for(let j = i  ; j <=98; j++){
                    usuario = chatMsgs.data[j+1];

                    mainArray[lastIndex] = usuario;
                    ultimo = "a"+lastIndex;
                    writeMessages(ultimo, usuario);
                    lastObj = usuario; 
                    lastIndex++;
                   
                }
                break;
            }
        }     
    }

}

function failGetMessage(response){
    alert("Falha ao recarregar msgs, recarregue a pagagina");
}

function writeMessages(last, usuario){




    const main = document.querySelector(".messages");
   
   
   
    main.innerHTML += `<p class="msg ${usuario.type} ${last}"><span class="hora">${usuario.time}</span>
        <span class="nome">${usuario.from}</span> ${usuario.text}</p>
    `
    const scroll = document.querySelector("."+last);
    scroll.scrollIntoView();


}

function sendMsg(){
    const message = document.querySelector(".send-msg").value;
    const textMsg = {
        from: nameUser.name,
        to: "todos",
        text: message,
        type: "message"
        
    }
    

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", textMsg);
    message.value = ''
    getMessage();



}


//reload users sidbar





function onOffSidbar(){

    const desativa = document.querySelector(".sidbar");
    desativa.classList.toggle("disabled");


}