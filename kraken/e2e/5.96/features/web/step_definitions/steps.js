const { Given, When, Then } = require("@cucumber/cucumber");
const PaginaLogin = require('../pages/pagina_login');
const PaginaPosts = require('../pages/pagina_posts');
const PaginaTags = require('../pages/pagina_tags');
const PaginaPages = require('../pages/pagina_pages');
const PaginaMiembros = require('../pages/pagina_members');

let paginaLogin, paginaPosts;

// Steps de login

Given("Abro Ghost", async function () {
    paginaLogin = new PaginaLogin(this.driver);
    await paginaLogin.abrirGhost();
});

When("Inicio de sesión inválido", async function () {
    await paginaLogin.iniciarSesionInvalido();
    await this.screenshotService.takeScreenshot('login_inicio_sesion_invalido_1');
});

When("Inicio de sesión válido", async function () {
    await paginaLogin.iniciarSesionValido();
    await this.screenshotService.takeScreenshot('login_inicio_sesion_valido_1');
});

Then("Debo ver mensaje {string}", async function (message) {
    const errorMessage = await paginaLogin.obtenerMensajeError();
    await this.screenshotService.takeScreenshot('login_inicio_sesion_invalido_2');
    return errorMessage;
});

Then("Debo ver el dashboard", async function () {
    const url = await paginaLogin.obtenerUrl();
    await this.screenshotService.takeScreenshot('login_inicio_sesion_valido_2');
    return url;
});

When("Salgo de la sesión", async function () {
    await paginaLogin.cerrarSesion();
    await this.screenshotService.takeScreenshot('login_cerrar_sesion');
});

Then("Debo ver página de login", async function () {
    const url = await paginaLogin.obtenerUrl();
    return url;
});


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
        
        if(linkText === "Update"){
            await this.screenshotService.takeScreenshot('post_editar_post');
        }

        if(linkText === "Ver preview post"){
            await this.screenshotService.takeScreenshot('post_previsualizacion_post');
        }

        if(linkText === "eliminar post"){
            await this.screenshotService.takeScreenshot('post_eliminar_post');
        }
        
        if(linkText === "Publish post, right now - crear"){
            await this.screenshotService.takeScreenshot('post_crear');
        } 
        
        if(linkText === "Publish post, right now - draft publicado" )
        {
                await this.screenshotService.takeScreenshot('post_cambiarestadodraft');
        } 
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
    await this.screenshotService.takeScreenshot('post_programacion_post');
});

Then(/^I should see the preview title "([^"]*)"$/, async function (expectedTitle) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    const resultado = await paginaPosts.verificarPreviewTitulo(expectedTitle);
    if (!resultado) {
        throw new Error(`No se pudo verificar el título del preview "${expectedTitle}"`);
    }
});

Then(/^the post "([^"]*)" should not be present in the post list$/, async function (postName) {
    if (!paginaPosts) paginaPosts = new PaginaPosts(this.driver);
    const noExiste = await paginaPosts.verificarPostNoExiste(postName);
    if (!noExiste) {
        throw new Error(`El post "${postName}" todavía está presente en la lista cuando debería haber sido eliminado.`);
    }
    return true;
});

When('Navego a tags', async function () {
    if (!paginaTags) paginaTags = new PaginaTags(this.driver);
    await paginaTags.navegarATags();
    await this.screenshotService.takeScreenshot('navego_a_tags');
});

When('Creo un nuevo tag con nombre {kraken-string}, color {kraken-string}, descripción {kraken-string}', async function (nombre, color, descripcion) {
    if (!paginaTags) paginaTags = new PaginaTags(this.driver);
    await paginaTags.crearNuevoTag(nombre, color, descripcion);
    await this.screenshotService.takeScreenshot('creo_nuevo_tag');
});

When('Elimino el tag con nombre {kraken-string}', async function (nombre) {
    if (!paginaTags) paginaTags = new PaginaTags(this.driver);
    await paginaTags.eliminarTag(nombre);
    await this.screenshotService.takeScreenshot('elimino_tag');
});

Then('El tag {kraken-string} no debería estar presente en la lista de tags', async function (nombre) {
    if (!paginaTags) paginaTags = new PaginaTags(this.driver);
    const noExiste = await paginaTags.verificarTagNoExiste(nombre);
    if (!noExiste) {
        throw new Error(`El tag "${nombre}" aún existe en la lista.`);
    }
    await this.screenshotService.takeScreenshot('verificar_tag_no_existe');
});

// Steps de páginas

When('Navego a páginas', async function () {
    if (!paginaPages) paginaPages = new PaginaPages(this.driver);
    await paginaPages.navegarAPages();
    await this.screenshotService.takeScreenshot('navego_a_paginas');
});

When('Creo una nueva página con título {kraken-string} y contenido {kraken-string}', async function (titulo, contenido) {
    if (!paginaPages) paginaPages = new PaginaPages(this.driver);
    await paginaPages.crearNuevaPagina(titulo, contenido);
    await this.screenshotService.takeScreenshot('creo_nueva_pagina');
});

Then('La página {kraken-string} debería estar presente en la lista de páginas', async function (titulo) {
    if (!paginaPages) paginaPages = new PaginaPages(this.driver);
    const existe = await paginaPages.verificarPaginaEnLista(titulo);
    if (!existe) {
        throw new Error(`La página "${titulo}" no está presente en la lista.`);
    }
    await this.screenshotService.takeScreenshot('verificar_pagina_presente');
});

When('Elimino la página con título {kraken-string}', async function (titulo) {
    if (!paginaPages) paginaPages = new PaginaPages(this.driver);
    await paginaPages.eliminarPagina(titulo);
    await this.screenshotService.takeScreenshot('elimino_pagina');
});

Then('La página {kraken-string} no debería estar presente en la lista de páginas', async function (titulo) {
    if (!paginaPages) paginaPages = new PaginaPages(this.driver);
    const noExiste = await paginaPages.verificarPaginaNoExiste(titulo);
    if (!noExiste) {
        throw new Error(`La página "${titulo}" aún existe en la lista.`);
    }
    await this.screenshotService.takeScreenshot('verificar_pagina_no_existe');
});

// Steps de miembros

When('Navego a miembros', async function () {
    if (!paginaMiembros) paginaMiembros = new PaginaMiembros(this.driver);
    await paginaMiembros.navegarAMiembros();
    await this.screenshotService.takeScreenshot('navego_a_miembros');
});

When('Creo un nuevo miembro con nombre {kraken-string}, email {kraken-string}, nota {kraken-string}', async function (nombre, email, nota) {
    if (!paginaMiembros) paginaMiembros = new PaginaMiembros(this.driver);
    await paginaMiembros.crearNuevoMiembro(nombre, email, nota);
    await this.screenshotService.takeScreenshot('creo_nuevo_miembro');
});

Then('El miembro con email {kraken-string} debería estar presente en la lista de miembros', async function (email) {
    if (!paginaMiembros) paginaMiembros = new PaginaMiembros(this.driver);
    const existe = await paginaMiembros.verificarMiembroEnLista(email);
    if (!existe) {
        throw new Error(`El miembro con email "${email}" no está presente en la lista.`);
    }
    await this.screenshotService.takeScreenshot('verificar_miembro_presente');
});

When('Elimino el miembro con email {kraken-string}', async function (email) {
    if (!paginaMiembros) paginaMiembros = new PaginaMiembros(this.driver);
    await paginaMiembros.eliminarMiembro(email);
    await this.screenshotService.takeScreenshot('elimino_miembro');
});

Then('El miembro con email {kraken-string} no debería estar presente en la lista de miembros', async function (email) {
    if (!paginaMiembros) paginaMiembros = new PaginaMiembros(this.driver);
    const noExiste = await paginaMiembros.verificarMiembroNoExiste(email);
    if (!noExiste) {
        throw new Error(`El miembro con email "${email}" aún existe en la lista.`);
    }
    await this.screenshotService.takeScreenshot('verificar_miembro_no_existe');
});
