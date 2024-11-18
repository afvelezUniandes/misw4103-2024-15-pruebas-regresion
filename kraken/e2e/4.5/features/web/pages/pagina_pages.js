const path = require('path');
const properties = require(path.join(__dirname, '../../../properties.json'));

class PaginaPages {
    constructor(driver) {
        this.driver = driver;
    }

    async navegarAPages() {
        await this.driver.$('a[href="#/pages/"]').click();
        await this.driver.pause(1000);
    }

    async crearNuevaPagina(titulo, contenido) {
        await this.driver.$('a[href="#/editor/page/"]').click();
        await this.driver.pause(500);
        await this.driver.$('textarea[placeholder="Page Title"]').setValue(titulo);
        await this.driver.$('.koenig-editor__editor').setValue(contenido);
        await this.driver.$('.gh-publishmenu-trigger').click();
        await this.driver.pause(500);
        await this.driver.$('.gh-publishmenu-button').click();
        await this.driver.pause(1000);
    }

    async verificarPaginaEnLista(titulo) {
        await this.navegarAPages();
        await this.driver.pause(1000);
        const pages = await this.driver.$$('.gh-content-entry-title');
        for (const page of pages) {
            const pageTitle = await page.getText();
            if (pageTitle.trim() === titulo) {
                return true;
            }
        }
        return false;
    }

    async eliminarPagina(titulo) {
        await this.navegarAPages();
        await this.driver.pause(1000);
        const pageElement = await this.driver.$(`h3.gh-content-entry-title=${titulo}`);
        await pageElement.click();
        await this.driver.pause(500);
        await this.driver.$('.settings-menu-toggle').click();
        await this.driver.$('button.settings-menu-delete-button').click();
        await this.driver.$('.modal-footer .gh-btn-red').click();
        await this.driver.pause(1000);
    }

    async verificarPaginaNoExiste(titulo) {
        await this.navegarAPages();
        await this.driver.pause(1000);
        const pages = await this.driver.$$('.gh-content-entry-title');
        for (const page of pages) {
            const pageTitle = await page.getText();
            if (pageTitle.trim() === titulo) {
                return false;
            }
        }
        return true;
    }
}

module.exports = PaginaPages;
