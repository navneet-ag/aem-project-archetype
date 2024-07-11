describe('Insurance Application Form', () => {

    const pagePath = '/content/forms/af/hackathon/insurance_application.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('should add a new child to the panel on clicking the button', () => {
        const buttonSelector = '#button-a8ec8007d8 .cmp-adaptiveform-button__widget';
        const panelSelector = '#panelcontainer-41af69da6b';
        // const initialChildrenCount = formContainer._fields['panelcontainer-0e22463be5'].children.length;
        //
        // cy.get(panelSelector).then(($panel) => {
        //     const newChildrenCount = formContainer._fields['panelcontainer-0e22463be5'].children.length;
        //     expect(newChildrenCount).to.be.eq(initialChildrenCount + 1);
        // });
        const initialCount = cy.getRepeatedPanelCount(panelSelector);
        cy.get(buttonSelector).click();
        const newCount = cy.getRepeatedPanelCount(panelSelector);
        expect(newCount).to.be.eq(initialCount + 1);
    });

});
