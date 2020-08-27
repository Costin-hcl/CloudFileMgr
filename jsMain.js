function jsmain() {
    showAuth();
}

function showAuth() {

    console.log(getUser());
}

async function getUser() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal.userDetails;
}