async function requestGPT(question, temperature = 0, max_tokens = 600) {
    console.log("Question : " + question)

        var response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": question}],
            temperature: temperature,
            max_tokens: max_tokens,
          }),
        });
        
        var json = await response.json();

        // Check if the response is valid
        json = JSON.stringify(json, null, 2);

        json = JSON.parse(json);
        console.log(json);
        
        if (json.choices) {
            return json.choices[0].message.content;
        } else {
            console.error("Error GPTDiff: " + json.error);
            return "Error GPTDiff: " + json.error.message;
        }
}

function appendDiv() {
    var div = document.createElement('div');
    div.id = "GPTDiv";

    var arrow = document.createElement('div');
    arrow.className = "arrow";
    arrow.innerHTML = "▼";
    arrow.onclick = function() {
        div.classList.toggle("active");
    }

    var form = document.createElement('form');

    var input = document.createElement('input');
    input.type = "text";
    input.className = "input";

    var sliderTemp = document.createElement('input');
    sliderTemp.type = "range";
    sliderTemp.min = "0";
    sliderTemp.max = "1";
    sliderTemp.step = "0.1";
    sliderTemp.value = "0";

    var sliderMaxTokens = document.createElement('input');
    sliderMaxTokens.type = "range";
    sliderMaxTokens.min = "10";
    sliderMaxTokens.max = "1000";
    sliderMaxTokens.step = "10";
    sliderMaxTokens.value = "50";

    var answer = document.createElement('p');
    answer.className = "answer";

    var submit = document.createElement('input');
    submit.type = "submit";
    submit.innerHTML = "Demander";
    
    form.onsubmit = async function(e) {
        e.preventDefault();
        answer.innerHTML = "Chargement en cours...";
        var response = await requestGPT(
          input.value,
          parseFloat(sliderTemp.value),
          parseInt(sliderMaxTokens.value)
        );
        //transforme \n en <br>, if two \n, then only one <br>
        
        response = response.replace(/\n/g, "<br>");
        response = response.replace(/<br><br>/g, "<br>");

        answer.innerHTML = response;
    }
    // add a scrollbar to the div
    
    


    var pTemp = document.createElement('p');
    pTemp.innerHTML = "Température : " + sliderTemp.value;
    
    var pMaxTokens = document.createElement('p');
    pMaxTokens.innerHTML = "Max tokens: " + sliderMaxTokens.value;
    
    
    
    form.appendChild(input);
    form.appendChild(sliderTemp);
    form.appendChild(pTemp);
    form.appendChild(sliderMaxTokens);
    form.appendChild(pMaxTokens);
    form.appendChild(submit);
    div.appendChild(arrow);
    div.appendChild(form);
    div.appendChild(answer);
    
    sliderMaxTokens.oninput = function () {
        pMaxTokens.innerHTML = "Max tokens: " + this.value;
    };
    
    sliderTemp.oninput = function () {
        pTemp.innerHTML = "Température : " + this.value;
    };
    
    document.body.appendChild(div);

    document.onkeydown = function(e) {
        // keycode of ² is 192
        if (e.keyCode == 113) {
            e.preventDefault();
            div.classList.toggle("active");

            if (div.classList.contains("active")) {
                input.focus();
            }

            
        }
    }
}
appendDiv();