let index = 0;
let responses = {};

function update_dom()
{
    let updateHTML = construct_survey_questions();
    document.getElementById("quiz-box").innerHTML = updateHTML;

    document.getElementById("next-button").addEventListener("click", () => {
        if (input_not_null())
        {
            document.getElementById("error-message").style.display = "none";
            store_responses();
            if (index < survey_questions.length - 1) index++;
            update_dom();
        }
        else
        {
            document.getElementById("error-message").style.display = "block";
        }
    });

    document.getElementById("prev-button").addEventListener("click", () => {
        if (index > 0) index--;
        update_dom();
    });

    document.getElementById("review-button").addEventListener("click", () => {
        if (input_not_null())
        {
            document.getElementById("error-message").style.display = "none";
            store_responses();
            index ++;
            update_dom();
        }
        else
        {
            document.getElementById("error-message").style.display = "block";
        }

    });

    document.getElementById("submit-button").addEventListener("click", () => {
        submit_survey();
        document.getElementById("quiz-box").innerHTML = 
        `
        <p> ThankYou for completing our survey </p>
        `;
    });

}

function construct_survey_questions()
{
    let inputHTML = "";

    if (index === survey_questions.length)
    {
        inputHTML += construct_form();
        inputHTML += 
        `
        <div class="button-container">
            <button id="prev-button" type="button" style="display: none;">Previous</button> 
            <button id="next-button" type="button" style="display: none;">Next</button>
            <button id="review-button" type="button" style="display: none;">Review</button>
            <button id="submit-button" type="button">Submit</button>
        </div>
        `;
        return inputHTML;
    }

    const current_question = survey_questions[index];

    if (current_question.type === "choice")
    {
        if (current_question.multiple === "yes")
        {
            inputHTML = 
            `
            <label for="${current_question.name}">${current_question.text}</label>
            <table>
            `;
            inputHTML += current_question.options.map((opt,j) =>
                `
                <tr> <td>${opt}</td> <td><input type="checkbox" name="${current_question.name}" id="${current_question.name}_${j}" value="${opt}" placeholder="${current_question.description}" required> </td> </tr>
                `
            ).join("");
            inputHTML += 
            `
            </table>
            `;
        }
        else
        {
            inputHTML = 
            `
            <label for="${current_question.name}">${current_question.text}</label>
            <table>
            `;
            inputHTML += current_question.options.map((opt, j) =>
                `
                <tr> <td>${opt}</td> <td> <input type="radio" name="${current_question.name}" id="${current_question.name}_${j}" value="${opt}" placeholder="${current_question.description}" required> </td> </tr>
                `
            ).join("");
            inputHTML += 
            `
            </table>
            `;
        }
    }
    else if (current_question.type === "long_text")
    {
        inputHTML = 
        `
        <label for="${current_question.name}">${current_question.text}</label>
        <textarea name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" required></textarea>
        `;
    }
    else if (current_question.type === "file")
    {
        inputHTML = 
        `
        <label for="${current_question.name}">${current_question.text}</label>
        <input type="${current_question.type}" name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" accept=".pdf" multiple required>
        `;  
    }
    else
    {
        inputHTML = 
        `
        <label for="${current_question.name}">${current_question.text}</label>
        <input type="${current_question.type}" name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" required>
        `;
    }

    if (index === 0)
    {
        inputHTML += 
        `
        <div class="button-container"> 
            <button id="next-button" type="button">Next</button>
            <button id="prev-button" type="button" style="display: none;">Previous</button> 
            <button id="review-button" type="button" style="display: none;">Review</button>
            <button id="submit-button" type="button" style="display: none;">Submit</button>
        </div>
        `;
    }
    else if (index === (survey_questions.length - 1))
    {
        inputHTML += 
        `
        <div class="button-container">
            <button id="next-button" type="button" style="display: none;">Next</button>
            <button id="prev-button" type="button">Previous</button> 
            <button id="review-button" type="button">Review</button>
            <button id="submit-button" type="button" style="display: none;">Submit</button>
        </div>
        `;
    }
    else
    {
        inputHTML += 
        `
        <div class="button-container">
            <button id="prev-button" type="button">Previous</button> 
            <button id="next-button" type="button">Next</button>
            <button id="review-button" type="button" style="display: none;">Review</button>
            <button id="submit-button" type="button" style="display: none;">Submit</button>
        </div>
        `;
    }

    return inputHTML;
}

function construct_form()
{

    let form = document.getElementById("survey-form");
    let formHTML = "<h3> Confirm your responses </h3>";
    for (let index = 0; index < survey_questions.length; index ++)
    {
        let current_question = survey_questions[index];
        let name = current_question.name;
        let response = responses[name];

        if (current_question.type === "choice")
            {
                if (current_question.multiple === "yes")
                {
                    formHTML += 
                    `
                    <label for="${current_question.name}">${current_question.text}</label>
                    <table>
                    `;
                    current_question.options.forEach((opt, j) => {
                        const checked = response.includes(opt) ? "checked" : "";
                        formHTML += 
                        `
                        <tr> <td>${opt}</td> <td> <input type="checkbox" name="${current_question.name}" id="${current_question.name}_${j}" value="${opt}" placeholder="${current_question.description}" ${checked}> </td> </tr>
                        `;
                    });
                    formHTML += 
                    `
                    </table>
                    `;
                }
                else
                {
                    formHTML += 
                    `
                    <label for="${current_question.name}">${current_question.text}</label>
                    <table>
                    `;
                    current_question.options.forEach((opt, j) => {
                        const checked = response.includes(opt) ? "checked" : "";
                        formHTML += 
                        `
                        <tr><td>${opt}</td> <td> <input type="radio" name="${current_question.name}" id="${current_question.name}" value="${opt}" placeholder="${current_question.description}" ${checked} required> </td> </tr>
                        `;
                    });
                    formHTML += 
                    `
                    </table>
                    `;

                }
            }
            else if (current_question.type === "long_text")
            {
                formHTML += 
                `
                <label for="${current_question.name}">${current_question.text}</label>
                <textarea name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" required>${response}</textarea>
                `;
            }
            else if (current_question.type === "file")
            {
                formHTML += 
                `
                <label for="${current_question.name}">${current_question.text}</label>
                <input type="${current_question.type}" name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" accept=".pdf" multiple>
                <small>Selected files: 
                ${
                    Array.isArray(response) ? response.map(f => f.name).join(", ") : (response?.name || "")
                }
                </small><br>
                `;  
            }
            else
            {
                formHTML += 
                `
                <label for="${current_question.name}">${current_question.text}</label>
                <input type="${current_question.type}" name="${current_question.name}" id="${current_question.name}" placeholder="${current_question.description}" value="${response}" required>
                `;
            }
    }

    return formHTML;
}

function input_not_null()
{
    const current_question = survey_questions[index];
    if (current_question.type === "choice")
    {
        const inputs = document.getElementsByName(current_question.name);
        for (let i = 0; i < inputs.length; i++)
        {
            if (inputs[i].checked)
            {
                return true;
            }
        }
        return false;
    }
    else
    {
        current_input = document.getElementById(`${current_question.name}`);
        return current_input && current_input.value.trim() !== "";
    }


}

function store_responses()
{
    let current_question = survey_questions[index];
    let name = current_question.name;

    if (current_question.type === "choice")
    {
        if (current_question.multiple == "yes")
        {
            let values = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
            responses[name] = values;
        }
        else
        {
            let selected = document.querySelector(`input[name="${name}"]:checked`);
            responses[name] = selected ? selected.value : "";
        }
    }
    else if (current_question.type === "file")
    {
        let input = document.querySelector(`input[name="${name}"]`);
        responses[name] = input ? Array.from(input.files) : "";
    }
    else
    {
        let input = document.querySelector(`input[name="${name}"]`) || document.querySelector(`textarea[name="${name}"]`);
        responses[name] = input ? input.value : ""
    }
}

async function submit_survey()
{
    const form = document.getElementById("survey-form")
    const formData = new FormData(form);

    const file_input = form.querySelector('input[name="certificates"]');
    if (file_input && file_input.files.length > 0)
    {}
    else
    {
        if (responses["certificates"])
        {
            responses["certificates"].forEach(file => {
                formData.append("certificates", file);
            });
        }
    }

    const response = await fetch("/api/questions/responses", {
        method: "PUT",
        body: formData,
    });

    const result = await response.json();

}

function fetch_survey()
{

    let questions = {
        "survey_questions" : [
            {
                "id" : "1",
                "name" : "full_name",
                "type" : "short_text",
                "required" : "yes",
                "text" : "What is your full name ?",
                "description" : "[Surname] [First Name] [Other Names]"
            },
            {
                "id" : "2",
                "name" : "email_address",
                "type" : "email",
                "required" : "yes",
                "text" : "What is your email address ?",
                "description" : "example@example.com"
            },
            {
                "id" : "3",
                "name" : "description",
                "type" : "long_text",
                "required" : "yes",
                "text" : "Tell us a bit more about yourself.",
                "description" : ""
            },
            {
                "id" : "4",
                "name" : "gender",
                "type" : "choice",
                "required" : "yes",
                "text" : "What is your gender ?",
                "description" : "",
                "multiple" : "no",
                "options" : ["MALE", "FEMALE", "OTHER"]
            },
            {
                "id" : "5",
                "name" : "programming_stack",
                "type" : "choice",
                "required" : "yes",
                "text" : "What programming stack are you familiar with ?",
                "description" : "You can select multiple.",
                "multiple" : "yes",
                "options" : ["REACT", "ANGULAR", "VUE", "SQL", "POSTGRES", "MYSQL", "MSSQL", "JAVA", "PHP", "GO", "RUST"]
            },
            {
                "id" : "6",
                "name" : "certificates",
                "type" : "file",
                "required" : "yes",
                "text" : "Upload any of your certificates ?",
                "description" : "You can upload multiple (.pdf)",
                "file_properties" : {
                    "format" : ".pdf",
                    "max_file_size" : "1",
                    "max_file_size_unit" : "mb",
                    "multiple" : "yes"
                }
            }
        ]
    };
    return questions;
}


let survey_questions = fetch_survey();
survey_questions = survey_questions.survey_questions;
update_dom();


