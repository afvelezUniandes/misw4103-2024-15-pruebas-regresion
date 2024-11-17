const { Given, When, Then } = require("@cucumber/cucumber");
const path = require('path');
const PaginaLogin = require('../pages/pagina_login');
const PaginaPosts = require('../pages/pagina_posts');

let paginaLogin, paginaPosts;

// Steps de login

Given("Abro Ghost", async function () {
    paginaLogin = new PaginaLogin(this.driver);
    await paginaLogin.abrirGhost();
});

When("Inicio de sesión inválido", async function () {
    await paginaLogin.iniciarSesionInvalido();
});

When("Inicio de sesión válido", async function () {
    await paginaLogin.iniciarSesionValido();
});

Then("Debo ver mensaje {string}", async function (message) {
    const errorMessage = await paginaLogin.obtenerMensajeError();
    return errorMessage;
});

Then("Debo ver el dashboard", async function () {
    const url = await paginaLogin.obtenerUrl();
    return url;
});

When("Salgo de la sesión", async function () {
    await paginaLogin.cerrarSesion();
});

Then("Debo ver página de login", async function () {
    const url = await paginaLogin.obtenerUrl();
    return url;
});

// Steps de posts manteniendo compatibilidad con Kraken
When('I enter email {kraken-string}', async function (email) {
    let element = await this.driver.$('#identification');
    return await element.setValue(email);
});

When('I enter password {kraken-string}', async function (password) {
    let element = await this.driver.$('#password');
    return await element.setValue(password);
});

When('I click next', async function() {
    let element = await this.driver.$('#ember5');
    return await element.click();
});

When('I enter post name {kraken-string}', async function (post) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    await paginaPosts.ingresarTituloPost(post);
});

When('I enter post description {kraken-string}', async function (description) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    await paginaPosts.ingresarDescripcionPost(description);
});

When(/^I click on the link with text "([^"]*)"$/, async function (linkText) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    
    if (linkText.startsWith("obtener post ")) {
        const titulo = linkText.replace("obtener post ", "");
        await paginaPosts.obtenerPost(titulo);
    } else {
        await paginaPosts.clickBoton(linkText);
    }
});

Then(/^the post "([^"]*)" should be present in the post list$/, async function (postName) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    const existe = await paginaPosts.verificarPostEnLista(postName);
    if (!existe) {
        throw new Error(`El post "${postName}" no está presente en la lista.`);
    }
});

Then(/^the post "([^"]*)" should be present in the post schedule list$/, async function (postName) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    const existe = await paginaPosts.verificarPostEnListaProgramados(postName);
    if (!existe) {
        throw new Error(`El post "${postName}" no está presente en la lista de programados.`);
    }
});