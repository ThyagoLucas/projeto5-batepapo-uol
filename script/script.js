// Global variables//

let nameUser = null;
let mainArray = [];
let lastMessage = null;


//-----Request section------//


//login
function loginAuthentication(){

    const inputName = document.querySelector(".user").value;
    const user = {
        name: inputName
      }
   
      nameUser = user;

    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promisse.then(setTimeout(loginSucess, 2000));
    promisse.catch(loginFail);

}
function loginSucess(response){

    const messagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    messagens.then(getMessage);
    messagens.catch(failGetMessage);    
    //so vai tirar a tela de login quando estiver com as mensagens;

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


//get message

function getMessage(response){

    const entrou = document.querySelector(".tela-login");
    entrou.classList.add("disabled");

    if(mainArray == 0) {
        let findFirst = false;
        let cont = 0 ;

        while(findFirst == false){
            let nome = response.data.from[cont];
            if(nome == nameUser){
                mainArray[0] = response.data[i];
                findFirst == true;
            }
            cont++;
        }
    }


    


    console.log(mainArray.data);
   
    if(mainArray.length==1){
        entrou.classList.add("disabled");
    }

   
        
}
function receiveMessage(response){
    
    if(mainArray.length == 0){
        mainArray[0] = response.data[99];
    }
    writeMessages();
    
}

function failGetMessage(response){
    alert("Falha ao recarregar msgs, recarregue a pagagina");
}

function refresArray(response){

    for(let o = 0; i<response.length; i++){



    }





    writeMessages();
}




function onOffSidbar(){
    const desativa = document.querySelector(".sidbar");
    desativa.classList.toggle("disabled");
}

function writeMessages(dadosmsg){
    const main = document.querySelector(".messages");
    main.innerHTML = '';
   
    main.innerHTML += `<p class="msg ${dadosmsg.type}"><span class="hora">${dadosmsg.time}</span>
        <span class="nome">${dadosmsg.from}</span> ${dadosmsg.text}</p>
    `

}


