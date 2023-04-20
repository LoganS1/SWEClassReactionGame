const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup");

signupButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = signupForm.username.value;
    const password = signupForm.password.value;

    //check user exists
    const doesUserExist = await fetch('/doesUserExist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });
    const result = await doesUserExist.json();

    if (result.exists) {
        alert('Username already exists. Please choose a different username.');

    } else {
        //User doesn't exist create new
        const createUser = await fetch('/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const createUserResult = await createUser.json();

        //created user, redirect to game
        if (createUserResult.success) {
            window.location.href = '/game';

            document.cookie = "sessionKey=" + data.sessionKey;

        } else {
            alert('Failed to create user. Please try again.');
        }
    }
});