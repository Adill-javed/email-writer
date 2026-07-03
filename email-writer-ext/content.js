// Configurable Production Backend API URL
// Replace "http://localhost:8080" with your actual hosted backend domain when deploying (e.g., https://email-writer-backend.onrender.com)
const API_BASE_URL = "http://localhost:8080";

console.log("Email Writer Extension -Content Script Loaded");
// mutationObserver is api watches the changes that are occuring in the dom tree and whenever a change 
// occur it will check wheather it matches the change that we need thenn it perform some operations that we are telling to do
// the changes will be stored in the array of addeddNodes 
function createAIButton() {
    const button=document.createElement('div');
    button.className='T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight='8px';
    button.innerHTML='AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI Reply');
    return button;
    

    
}

function getEmailContent() {
    const selectors=[
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="toolbar"]'
    ];
    for (const selector of selectors) {
       const content=document.querySelector(selector);
       if(content){
        return content.innerText.trim();
       } 
    }
    return '';
    
}


function findComposeToolbar() {
    const selectors=[
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gu.up'
    ];
    for (const selector of selectors) {
       const toolbar=document.querySelector(selector);
       if(toolbar){
        return toolbar;
       } 
       return null;
        
    }
    
}

function injectButton(){
    const existingButton=document.querySelector('.ai-reply-button');
    if(existingButton)existingButton.remove();
    const toolbar=findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, creating AI button");
    const button=createAIButton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click',async()=>{
        try {
            button.innerHTML='generating...';
            button.disabled=true;

            const emailContent=getEmailContent();
            const response =await fetch(`${API_BASE_URL}/api/email/generate`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',   
                },
                body:JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })

            });
            if(!response.ok){
                throw new Error('API Request Failed');
            }
            const generatedReply =await response.text();
            const composeBox=document.querySelector('[role="textbox"],[g_editable="true"]');
            if(composeBox){
                composeBox.focus();
                document.execCommand('insertText',false,generatedReply);
            }else{
                console.error('Compose box was  not found');
            }
        } catch (error) {
            console.error(error);
            alert('failed to generate reply');
        }finally{
            button.innerHTML='AI reply';
            button.disabled=false;
        }

    });
    toolbar.insertBefore(button,toolbar.firstChild);

}
const observer= new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes=Array.from(mutation.addedNodes);
        const hasComposeElements=addedNodes.some(node=>
            node.nodeType===Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
            //if changes matches the class name as .aDh .btc and role is dialog means the class names of gmail's button where we need to put our button 
        );
        //hascomposeElements will give us boolean value wheather the composedEleements are found in the dom or not
        if(hasComposeElements){
            console.log("Compose Window detected");
            setTimeout(injectButton,500);
        } 
    }
});
observer.observe(document.body,{
    childList:true,
    subtree:true
});