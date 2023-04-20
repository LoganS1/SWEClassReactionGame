const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const signupButton = document.getElementById("sign-up-form");

loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    login(username, password);
})

let login = async (username, password) => {
    let response = await fetch('/validateLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})

    });

    let data = await response.json();

    if (data.validated) {
        location.href="/game";

        document.cookie = "sessionKey=" + data.sessionKey;

        return true;

    } else {
        alert("Incorrect username and/or password");
        location.reload();
        return false;
    }
}

signupButton.addEventListener("click",(e) => {
    e.preventDefault();
    location.href="/signup";
})

modules.exports = login;
