describe("Pruebas de post", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P004 - Crear nuevo post", () => {
    // Given Abro Post
    cy.visit("/ghost/#/editor/post");
    cy.screenshot("P004-Paso1-PaginaDeEditor");

    // When Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]").type("Nuevo Post{enter}");
    cy.wait(1000);
    cy.screenshot("P004-Paso2-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.screenshot("P004-Paso3-ClickEnPublicar");

    // And doy click en el botón de publicar ahora
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.screenshot("P004-Paso4-ClickEnPublicarAhora");

    // And doy click en el botón de confirmar
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.screenshot("P004-Paso5-ClickEnConfirmar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P004-Paso6-MensajeDePublicado");
  });

  it("P005 - Editar post existente", () => {
    // Given Abro Post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P005-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Nuevo Post").click();
    cy.screenshot("P005-Paso2-ClickEnPost");

    // And Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type("Post Editado{enter}");
    cy.wait(1000);
    cy.screenshot("P005-Paso3-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-save"]')
      .contains("Update")
      .click();
    cy.screenshot("P005-Paso4-ClickEnPublicar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P005-Paso5-MensajeDePublicado");
  });

  it("P006 - Eliminar post", () => {
    // Given Abro Post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P006-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Post Editado").click();
    cy.screenshot("P006-Paso2-ClickEnPost");

    // And Hago click en el botón de opciones
    cy.get("button[data-test-psm-trigger]").click();
    cy.screenshot("P006-Paso3-ClickEnOpciones");

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="delete-post"]').click();
    cy.screenshot("P006-Paso4-ClickEnEliminar");

    // And Hago click en el botón de confirmar
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.screenshot("P006-Paso5-ClickEnConfirmar");

    // Then No debe existitir el post
    cy.contains("Post Editado").should("not.exist");
    cy.screenshot("P006-Paso6-PostEliminado");
  });

  it("P010 - Programar post", () => {
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type("Nuevo Post{enter}");
    cy.wait(1000);
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();

    cy.get('button[data-test-setting-title=""]').contains("Right now").click();
    cy.get("div.gh-radio").contains("Schedule").click();

    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });

  it("P007 - Guardar post como borrador", () => {
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(
      "Post en Borrador{enter}"
    );
    cy.visit("/ghost/#/posts");
    cy.contains("Draft");
  });

  it("P008 - Cambiar estado de borrador a publicado", () => {
    cy.visit("/ghost/#/posts");
    cy.contains("Post en Borrador").click();
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("P009 - Ver post publicado en frontend", () => {
    cy.visit("/ghost/#/posts");
    cy.contains("Post en Borrador").click();
    cy.wait(1000);
    cy.get('button[data-test-button="publish-preview"]')
      .contains("Preview")
      .click();
    cy.wait(2000);
    cy.get("iframe").then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).contains("Post en Borrador");
    });

    cy.visit("/ghost/#/posts");
    cy.contains("Post en Borrador").click();
    cy.get("button[data-test-psm-trigger]").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.contains("Post en Borrador").should("not.exist");
  });
});
