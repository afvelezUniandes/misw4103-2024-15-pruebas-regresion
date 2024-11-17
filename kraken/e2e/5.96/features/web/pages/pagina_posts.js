const path = require('path');
const properties = require(path.join(__dirname, '../../../properties.json'));

class PaginaPosts {
    constructor(driver) {
        this.driver = driver;
    }

    async ingresarTituloPost(titulo) {
        let element = await this.driver.$('textarea[placeholder="Post title"]');
        await element.setValue(titulo);
    }

    async ingresarDescripcionPost(descripcion) {
        let element = await this.driver.$('div[contenteditable="true"]');
        await element.setValue(descripcion);
    }

    async clickBoton(tipo) {
        let selector;
        switch(tipo) {
            case "Posts":
                selector = '[data-test-nav="posts"]';
                break;
            case "New post":
                selector = 'a[href="#/editor/post/"]';
                break;
            case "Publish":
                selector = '.gh-publish-trigger';
                break;
            case "Continue, final review":
                selector = '[data-test-button="continue"]';
                break;
            case "Publish post, right now":
                selector = '[data-test-button="confirm-publish"]';
                break;
            case "Editor":
                selector = '[data-test-button="close-publish-flow"]';
                break;
            case "opciones de cuando publicar":
                selector = '[data-test-setting="publish-at"] button';
                break;
            case "programar para publicar luego":
                selector = '.gh-publish-schedule .gh-radio:last-child';
                break;
            case "Update":
                selector = '[data-test-button="publish-save"]';
                break;
            default:
                throw new Error(`Tipo de botón no soportado: ${tipo}`);
        }
        await (await this.driver.$(selector)).click();
    }

    async obtenerPost(titulo) {
        const posts = await this.driver.$$('.gh-posts-list-item');
        for (const post of posts) {
            const titleElement = await post.$('.gh-content-entry-title');
            const titleText = await titleElement.getText();
            if (titleText.trim() === titulo) {
                await post.$('a.gh-list-data.gh-post-list-title').click();
                return;
            }
        }
        throw new Error(`No se encontró el post con título "${titulo}"`);
    }

    async verificarPostEnLista(postName) {
        await this.driver.pause(2000);
        const posts = await this.driver.$$('.gh-content-entry-title');
        for (const post of await posts) {
            const titleText = await post.getText();
            if (titleText.trim() === postName) {
                return true;
            }
        }
        return false;
    }

    async verificarPostEnListaProgramados(postName) {
        await this.driver.pause(2000);
        const posts = await this.driver.$$('.gh-posts-list-item-group .gh-content-entry-title');
        for (const post of await posts) {
            const titleText = await post.getText();
            if (titleText.trim() === postName) {
                return true;
            }
        }
        return false;
    }
}

module.exports = PaginaPosts;