describe('Insurance Application Form', () => {

    const pagePath = '/content/forms/af/hackathon/insurance_application.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('should add a new instance of panelcontainer-3079eba903 on clicking button-77f4339720-widget', () => {
        // Check initial state of the form to ensure the panel is not already added
        cy.get('.cmp-container').should('have.length', 1);
        // Click the button to add a new panel
        cy.get('.cmp-adaptiveform-button__widget').click();
        // Check if a new panel has been added
        cy.get('.cmp-container').should('have.length', 2);
    });

});