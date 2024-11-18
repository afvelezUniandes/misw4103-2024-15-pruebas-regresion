const path = require('path');
const properties = require(path.join(__dirname, '../../../properties.json'));

class PaginaMembers {
    constructor(driver) {
        this.driver = driver;
    }

    async navegarAMiembros() {
        await this.driver.$('a[href="#/members/"]').click();
        await this.driver.pause(1000);
    }

    async crearNuevoMiembro(nombre, email, nota) {
        await this.driver.$('a[href="#/members/new/"]').click();
        await this.driver.pause(500);
        await this.driver.$('#member-name').setValue(nombre);
        await this.driver.$('#member-email').setValue(email);
        if (nota) {
            await this.driver.$('#member-note').setValue(nota);
        }
        await this.driver.$('.view-actions button.gh-btn-primary').click();
        await this.driver.pause(1000);
    }

    async verificarMiembroEnLista(email) {
        await this.navegarAMiembros();
        await this.driver.pause(1000);
        const miembros = await this.driver.$$('.gh-members-list-email');
        for (const miembro of miembros) {
            const miembroEmail = await miembro.getText();
            if (miembroEmail.trim() === email) {
                return true;
            }
        }
        return false;
    }

    async eliminarMiembro(email) {
        await this.navegarAMiembros();
        await this.driver.pause(1000);
        const miembroElement = await this.driver.$(`p.gh-members-list-email=${email}`);
        await miembroElement.click();
        await this.driver.pause(500);
        await this.driver.$('.settings-menu-toggle').click();
        await this.driver.$('button.settings-menu-delete-button').click();
        await this.driver.$('.modal-footer .gh-btn-red').click();
        await this.driver.pause(1000);
    }

    async verificarMiembroNoExiste(email) {
        await this.navegarAMiembros();
        await this.driver.pause(1000);
        const miembros = await this.driver.$$('.gh-members-list-email');
        for (const miembro of miembros) {
            const miembroEmail = await miembro.getText();
            if (miembroEmail.trim() === email) {
                return false;
            }
        }
        return true;
    }
}

module.exports = PaginaMembers;
