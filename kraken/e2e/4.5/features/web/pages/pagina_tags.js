const path = require('path');
const properties = require(path.join(__dirname, '../../../properties.json'));

class PaginaTags {
    constructor(driver) {
        this.driver = driver;
    }

    async navegarATags() {
        await this.driver.$('a[href="#/tags/"]').click();
        await this.driver.pause(1000);
    }

    async crearNuevoTag(nombre, color, descripcion) {
        await this.driver.$('a[href="#/tags/new/"]').click();
        await this.driver.pause(500);
        await this.driver.$('#tag-name').setValue(nombre);
        if (color) {
            await this.driver.$('input[name="accent-color"]').setValue(color);
        }
        if (descripcion) {
            await this.driver.$('#tag-description').setValue(descripcion);
        }
        await this.driver.$('.view-actions button.gh-btn-primary').click();
        await this.driver.pause(1000);
    }

    async eliminarTag(nombre) {
        await this.navegarATags();
        await this.driver.pause(1000);
        const tagElement = await this.driver.$(`a.gh-tag-list-name=${nombre}`);
        await tagElement.click();
        await this.driver.pause(500);
        await this.driver.$('.gh-btn.gh-btn-red.gh-btn-icon').click();
        await this.driver.$('.modal-footer .gh-btn-red').click();
        await this.driver.pause(1000);
    }

    async verificarTagNoExiste(nombre) {
        await this.navegarATags();
        await this.driver.pause(1000);
        const tags = await this.driver.$$('.gh-tag-list-name');
        for (const tag of tags) {
            const tagName = await tag.getText();
            if (tagName.trim() === nombre) {
                return false;
            }
        }
        return true;
    }
}

module.exports = PaginaTags;
