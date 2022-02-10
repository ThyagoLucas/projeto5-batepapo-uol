


function requere (){
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

    promisse.then(recebemsg);
        
}

function recebemsg(conteudo){
    console.log(conteudo);

}