describe('AEM Forms layout form', () => {

    const pagePath = 'content/forms/af/navneeta/layoutform.html';
    let formContainer = null;

    beforeEach(() => {
        // End any existing user session
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('Navigate between the panel and check if fields present inside a panel are visible', () => {
        // Click on the next button to navigate to the Address Details panel
        cy.get('.cmp-adaptiveforms-wizard__nav--next').click();
        // Check if the fields inside the Address Details panel are visible
        cy.get('#textinput-342d8a7b19-widget').should('be.visible');
        cy.get('#textinput-f4ad156d5d-widget').should('be.visible');
        cy.get('#textinput-aa4bd48ce2-widget').should('be.visible');
        cy.get('#numberinput-eee03f140e-widget').should('be.visible');

        // Click on the next button to navigate to the Income Details panel
        cy.get('.cmp-adaptiveform-wizard__nav--next').click();
        // Check if the fields inside the Income Details panel are visible
        cy.get('#numberinput-8bc67e50cb-widget').should('be.visible');

        // Click on the previous button to navigate back to the Address Details panel
        cy.get('.cmp-adaptiveform-wizard__nav--previous').click();
        // Check if the fields inside the Address Details panel are still visible
        cy.get('#textinput-342d8a7b19-widget').should('be.visible');
        cy.get('#textinput-f4ad156d5d-widget').should('be.visible');
        cy.get('#textinput-aa4bd48ce2-widget').should('be.visible');
        cy.get('#numberinput-eee03f140e-widget').should('be.visible');

        // Click on the previous button to navigate back to the Personal Details panel
        cy.get('.cmp-adaptiveform-wizard__nav--previous').click();
        // Check if the fields inside the Personal Details panel are still visible
        cy.get('#textinput-bd769e30ce-widget').should('be.visible');
        cy.get('#textinput-5338ba77f6-widget').should('be.visible');
        cy.get('#telephoneinput-0d8b99d965-widget').should('be.visible');
    });

});
