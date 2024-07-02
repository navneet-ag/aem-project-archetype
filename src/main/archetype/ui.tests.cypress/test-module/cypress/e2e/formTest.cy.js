/*
 *  Copyright 2024 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

describe('AEM Forms contact us form', () => {

    const pagePath = "content/forms/af/navneeta/test-form.html";
    let formContainer = null

    beforeEach(() => {
        // End any existing user session
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    })

    it('form should be initialized properly', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    });

    it('Field Validations should work', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const nameInput = 'textinput-553834b35d';
        const emailInput = 'emailinput-0383a692af';
        cy.get(`#${nameInput}`).type("123");
        cy.get(`#${nameInput}`).find("input").focus().blur().then(x => {
            cy.get(`#${nameInput}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"Please enter a valid name.")
        })
        cy.get(`#${emailInput}`).type("invalid email");
        cy.get(`#${emailInput}`).find("input").focus().blur().then(x => {
            cy.get(`#${emailInput}`).find(".cmp-adaptiveform-emailinput__errormessage").should('have.text',"Please enter a valid email.")
        })
    });

    it('Check salary hide/show behaviour', () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const salaryInputId = "numberinput-6de71944e2";
        const employerDropDownId = "dropdown-7013aa122e";
        cy.get(`#${employerDropDownId} select`).select("Yes");
        cy.get(`#${salaryInputId}`).should('be.visible');

        cy.get(`#${employerDropDownId} select`).select("No");
        cy.get(`#${salaryInputId}`).should('not.be.visible');
    });

    it("Clicking the button should submit the form", () => {
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }, {
            statusCode: 200,
            body: {
            "submissionId": null,
            "redirectUrl": null,
            "thankYouMessage": "Thank you for submitting the form.",
            "metadata": {
            "prefillId": "6aa530bb-b2f1-4293-9b7c-14b08d6a7530"
        }            }
        }).as('afSubmission')
        const nameInput = 'textinput-553834b35d';
        const emailInput = 'emailinput-0383a692af';
        const salaryInputId = "numberinput-6de71944e2";
        const employerDropDownId = "dropdown-7013aa122e";
        cy.get(`#${nameInput}`).type("John");
        cy.get(`#${emailInput}`).type("john@abc.com");
        cy.get(`#${employerDropDownId} select`).select("Yes");
        cy.get(`#${salaryInputId}`).type("10000");

        cy.get(`.cmp-adaptiveform-button__widget`).click()
        cy.wait('@afSubmission',).then(({ response}) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.not.null;
            expect(response.body.thankYouMessage).to.be.not.null;
            expect(response.body.thankYouMessage).to.equal("Thank you for submitting the form.");
        })
    });


})

