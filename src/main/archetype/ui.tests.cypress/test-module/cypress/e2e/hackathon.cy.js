describe('Form input and validation test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('Give input \'John\' for field \'textinput1720604773886\' and error message should not be visible', () => {
    const textInputId = 'textinput-dddfc4140e';
    const errorMessageSelector = '.cmp-adaptiveform-textinput__errormessage';

    cy.typeText(textInputId, 'John', formContainer);
    cy.get(`#${textInputId}`).find(errorMessageSelector).should('not.be.visible');
  });

});

describe('Form input validation test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display error message for invalid input in textinput1720604773886', () => {
    const textInputId = 'textinput-dddfc4140e';
    const errorMessage = 'No special characters or spaces are allowed';
    cy.typeText(textInputId, 'John123', formContainer);
    cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', errorMessage);
  });

});

describe('Form input validation', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display error message for invalid input in Last Name field', () => {
    const lastNameFieldId = 'textinput-e99cbcaf89';
    const invalidInput = 'Doe@';
    const expectedErrorMessage = 'No special characters or spaces are allowed';

    cy.typeText(lastNameFieldId, invalidInput, formContainer);
    cy.get(`#${lastNameFieldId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', expectedErrorMessage);
  });

});

describe('Insurance Application Form', () => {

    const pagePath = '/content/forms/af/hackathon/insurance_application.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('Give input for email field and check error message visibility', () => {
        const emailInputId = 'emailinput-ecaa93ee4c';
        const email = 'jane.doe@example.com';

        cy.typeText(emailInputId, email, formContainer);
        cy.get(`#${emailInputId}`).find('.cmp-adaptiveform-emailinput__errormessage').should('not.be.visible');
    });

});

describe('Form field validation test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display an error message for invalid email input', () => {
    const emailInputId = 'emailinput-ecaa93ee4c';
    const invalidEmail = 'jane.doe';
    const errorMessageSelector = '.cmp-adaptiveform-emailinput__errormessage';

    cy.typeText(emailInputId, invalidEmail, formContainer);
    cy.get(`#${emailInputId}`).find('input').focus().blur();
    cy.get(`#${emailInputId}`).find(errorMessageSelector).should('be.visible');
  });

});

describe('Form input validation', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display an error message when invalid input is provided', () => {
    const textInputId = 'textinput-dddfc4140e';
    const errorMessage = 'No special characters or spaces are allowed';
    cy.typeText(textInputId, 'Alice!', formContainer);
    cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', errorMessage);
  });

});

describe('Form input validation test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display error message for invalid input', () => {
    const lastNameInputId = 'textinput-e99cbcaf89';
    const expectedErrorMessage = 'No special characters or spaces are allowed';
    cy.typeText(lastNameInputId, 'Smith ', formContainer);
    cy.get(`#${lastNameInputId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', expectedErrorMessage);
  });

});

describe('Form number input field formatting', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should display formatted salary after input', () => {
    const salaryInputId = 'numberinput-9a673e27d0';
    cy.typeText(salaryInputId, '50000', formContainer);
    cy.get(`#${salaryInputId}`).find('.cmp-adaptiveform-numberinput__widget').blur().then(() => {
      cy.get(`#${salaryInputId}`).find('.cmp-adaptiveform-numberinput__widget').should('have.value', '₹50,000.00');
    });
  });

});

describe('Form number input formatting', () => {

    const pagePath = '/content/forms/af/hackathon/insurance_application.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('should display formatted value for business income field', () => {
        const numberInputBusinessId = 'numberinput-87cd5918a1';
        cy.typeText(numberInputBusinessId, '120000', formContainer);
        cy.get(`#${numberInputBusinessId}`).find('.cmp-adaptiveform-numberinput__widget').blur().then(() => {
            cy.get(`#${numberInputBusinessId}`).find('.cmp-adaptiveform-numberinput__widget').should('have.value', '₹120,000.00');
        });
    });

});

describe('Form Read-Only Field Test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('field textinput1720609807048 should not be editable', () => {
    const textInputId = 'textinput-37fb10857b';
    cy.checkElementReadOnly(textInputId, formContainer);
  });

});

describe('Form field validation test', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('error message should be displayed when field textinput1720604773886 is focused and defocused', () => {
    const firstNameFieldId = 'textinput-dddfc4140e';
    cy.typeText(firstNameFieldId, '', formContainer);
    cy.get(`#${firstNameFieldId}`).find('.cmp-adaptiveform-textinput__widget').focus().blur();
    cy.get(`#${firstNameFieldId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', 'Please enter your first name');
  });

});

describe('Form validation for nominee first name', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('error message should be displayed when field textinput1720604773886 is focused and defocused', () => {
    const firstNameFieldId = 'textinput-ade5feeefa';
    cy.typeText(firstNameFieldId, '', formContainer);
    cy.get(`#${firstNameFieldId}`).find('.cmp-adaptiveform-textinput__widget').focus().blur();
    cy.get(`#${firstNameFieldId}`).find('.cmp-adaptiveform-textinput__errormessage').should('have.text', "Please enter the nominee's first name");
  });

});

describe('Verify radio button behavior', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should change visibility of numberinput_business and numberinput_salary fields when radiobutton1720605220772 value changes to Salaried', () => {
    const radioButtonId = 'radiobutton-f9ec88484e';
    const numberInputBusinessId = 'numberinput-87cd5918a1';
    const numberInputSalaryId = 'numberinput-9a673e27d0';

    // Select 'Salaried' option in radio button
    cy.clickRadioButton(radioButtonId, 0, formContainer);

    // Check that numberinput_business is not visible
    cy.checkElementVisibility(numberInputBusinessId, false, formContainer);

    // Check that numberinput_salary is visible
    cy.checkElementVisibility(numberInputSalaryId, true, formContainer);
  });

});

describe('Verify radio button selection changes field visibility', () => {

  const pagePath = '/content/forms/af/hackathon/insurance_application.html';
  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  it('should toggle visibility of numberinput_salary and numberinput_business based on radiobutton1720605220772 selection', () => {
    const radioButtonId = 'radiobutton-f9ec88484e';
    const salaryInputId = 'numberinput-9a673e27d0';
    const businessInputId = 'numberinput-87cd5918a1';

    // Select 'Business' option in radio button
    cy.clickRadioButton(radioButtonId, 1, formContainer);

    // Check that salary input is not visible and business input is visible
    cy.checkElementVisibility(salaryInputId, false, formContainer);
    cy.checkElementVisibility(businessInputId, true, formContainer);

    // Select 'Salaried' option in radio button
    cy.clickRadioButton(radioButtonId, 0, formContainer);

    // Check that salary input is visible and business input is not visible
    cy.checkElementVisibility(salaryInputId, true, formContainer);
    cy.checkElementVisibility(businessInputId, false, formContainer);
  });

});

describe('Insurance Application Form Submission', () => {

    const pagePath = '/content/forms/af/hackathon/insurance_application.html';
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then((p) => {
            formContainer = p;
        });
    });

    it('should submit the form successfully when all required fields are filled with valid data', () => {
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('formSubmission');

        // Fill in the required fields with valid data
        cy.typeText('textinput-dddfc4140e', 'John', formContainer);
        cy.typeText('textinput-e99cbcaf89', 'Doe', formContainer);
        cy.typeText('numberinput-1470d57e2c', '30', formContainer);
        cy.typeText('emailinput-ecaa93ee4c', 'john.doe@example.com', formContainer);
        cy.typeText('textinput-ade5feeefa', 'Jane', formContainer);
        cy.typeText('textinput-4318fb10d8', 'Doe', formContainer);
        cy.typeText('numberinput-a1e6aacfd7', '28', formContainer);
        cy.clickRadioButton('radiobutton-f9ec88484e', 0, formContainer);
        cy.typeText('numberinput-9a673e27d0', '50000', formContainer);

        // Agree to terms and conditions
        cy.clickCheckBox('checkbox-f28497431a', formContainer);

        // Submit the form
        cy.submitForm('submit-f312f67165', formContainer);

        // Verify the form submission was successful
        cy.wait('@formSubmission').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('success', true);
        });
    });

});