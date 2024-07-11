describe('Form Panel Addition Test', () => {

    const pagePath = '/content/forms/af/hackathon/test2.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('should add a new instance of panelcontainer1720614241741 when button1720614253408 is clicked', () => {
        const buttonId = 'button-1e1094f63e';
        const panelContainerId = 'panelcontainer-426650109e';

        cy.get(`#${buttonId}`).click().then(() => {
            cy.get(`#${panelContainerId}`).its('length').should('be.gt', 1);
        });
    });

})