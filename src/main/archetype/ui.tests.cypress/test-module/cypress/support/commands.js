/*
 *  Copyright 2023 Adobe Systems Incorporated
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

Cypress.Commands.add('AEMForceLogout', function () {
    cy.visit('/')

    cy.title().then(title => {
        if (!title || !title.includes('AEM Sign In')) {
            cy.visit('/system/sling/logout.html')
        }
    })

    cy.get('form[name="login"]', {timeout: 3000}).should('exist')
})

Cypress.Commands.add('AEMLogin', function (username, password) {
    if (Cypress.config().baseUrl.includes('adobeaemcloud.com') || Cypress.config().baseUrl.includes('adobeaemcloud.net')) {
        cy.get('#coral-id-0').click()
    }

    cy.get('#login').should('have.attr', 'action', '/libs/granite/core/content/login.html/j_security_check')

    cy.get('#username').type(username)
    cy.get('#password').type(password, { log: false, parseSpecialCharSequences: false })

    cy.get('#submit-button').click()
    cy.get('coral-shell-content', {timeout: 5000}).should('exist')
})

Cypress.Commands.add('AEMPathExists', function (baseUrl, path) {
    const url = new URL(path, baseUrl)

    console.log('COMMAND CALLED - START')

    return cy.request({
        url: url.href,
        failOnStatusCode: false,
    })
        .then(response => {
            return (response.status === 200)
        });
})

Cypress.Commands.add('AEMDeleteAsset', function (assetPath) {
    const tokenUrl = new URL('/libs/granite/csrf/token.json', Cypress.env('AEM_AUTHOR_URL'))
    let csrfToken;

    cy.request(tokenUrl.href).then((response) => {
        csrfToken = response.body.token

        const form = new FormData();
        form.append('cmd', 'deletePage');
        form.append('path', assetPath);
        form.append('force', 'true');
        form.append('_charset_', 'utf-8');

        const body = {
            cmd: 'deletePage',
            path: assetPath,
            force: true,
            "_charset_": 'utf-8',
        }

        const url = new URL('/bin/wcmcommand', Cypress.env('AEM_AUTHOR_URL'))

        const referrerUrl = new URL(assetPath, Cypress.env('AEM_AUTHOR_URL'))

        // application/x-www-form-urlencoded; charset=UTF-8

        cy.request({
            url: url.href,
            method: 'POST',
            headers: {
                'CSRF-Token': csrfToken,
                Referer: referrerUrl,
            },
            form: true,
            body: body,
        })
    })
})

Cypress.Commands.add('waitUntil', function (innerFunction, options = {}) {
    // Determine wait parameters
    const errorMsg = options.errorMsg || 'timed out';
    const timeout = options.timeout || 3000;
    const interval = options.interval || 200;
    let retries = Math.floor(timeout / interval)

    // Evaluate the result and retry if needed
    const checkResult = (result) => {
        // Function succeeded, stop
        if (result) {
            return result
        }
        // Retries exceeded, fail
        if (retries < 1) {
            throw new Error(errorMsg)
        }
        // Wait and trigger a retry
        cy.wait(interval, {log: false}).then(() => {
            cy.log('Retrying...')
            retries--
            return callFunction()
        })
    }

    // Call the actual function
    const callFunction = () => {
        const result = innerFunction()

        const isPromise = Boolean(result && result.then)
        if (isPromise) {
            return result.then(checkResult)
        } else {
            return checkResult(result)
        }
    }

    return callFunction()
})

Cypress.Commands.add("login", (pagePath, failurehandler = () => {}) => {
    const username = Cypress.env('AEM_AUTHOR_USERNAME') ? Cypress.env('AEM_AUTHOR_USERNAME') : "admin";
    const password = Cypress.env('AEM_AUTHOR_PASSWORD') ? Cypress.env('AEM_AUTHOR_PASSWORD') : "admin";
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    let retryCount = 0;
    let maxRetries = 3;
    // Check if the element with id 'submit-button' exists
    cy.get('body').then(($body) => {
        const element = $body.find('#submit-button');
        if (element.length === 0) {
            // Element is not present
            retryCount++;
            if (retryCount <= maxRetries) {
                // Retry the visit with an exponential backoff delay
                const delay = Math.pow(2, retryCount - 1) * 1000; // 2^n seconds
                cy.wait(delay);
                failurehandler();
            }
        } else {
            // Element is present, click it
            cy.wrap(element).click();
        }
    });
});

Cypress.Commands.add("openPage", (pagePath, options = {}) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : 'http://localhost:4502';
    let path = ((contextPath && !pagePath.startsWith(contextPath)) ? `${contextPath}${pagePath.startsWith('/') ? '' : '/'}${pagePath}` : pagePath);
    if (!options.noLogin) {
        // getting status 403 intermittently, just ignore it
        const baseUrl = contextPath;
        cy.visit(baseUrl, {'failOnStatusCode': false});
        cy.getCookie('login-token').then(cookie => {
            if(!cookie) {
                cy.login(baseUrl, () => {
                    cy.openPage(path, options);
                });
            }
        })
    }
    cy.visit(path, options);
});

Cypress.Commands.add("previewForm", (formPath, options = {}) => {
    const contextPath = Cypress.env('crx.contextPath') ? Cypress.env('crx.contextPath') : "http://localhost:4502";
    let pagePath = contextPath ? `${contextPath}${formPath.startsWith('/') ? '' : '/'}${formPath}?wcmmode=disabled` : `${formPath}?wcmmode=disabled`;
    if (options?.params) {
        options.params.forEach((param) => pagePath += `&${param}`)
        delete options.params
    }
    if(options?.multipleEmbedContainers) {
        return cy.openPage(pagePath, options).then(() => waitForFormInitMultipleContiners(options?.multipleEmbedContainers))
    }
    if(options?.multipleContainers) {
        return cy.openPage(pagePath, options).then(waitForFormInitMultipleContiners)
    }
    return cy.openPage(pagePath, options).then(waitForFormInit)
})


const waitForFormInit = () => {
    const INIT_EVENT = "AF_FormContainerInitialised"
    return cy.document().then(document => {
        cy.get('form').then(($form) => {
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    if(document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']")?.classList.contains("cmp-adaptiveform-container--loading")){
                        const isReady = () => {
                            const container = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']");
                            if (container &&
                                e.detail._path === $form.data("cmp-path") &&
                                !container.classList.contains("cmp-adaptiveform-container--loading")) {

                                resolve(e.detail);
                            }
                            setTimeout(isReady, 0)
                        }
                        isReady();
                    }
                }
                document.addEventListener(INIT_EVENT, listener1);
            })
            return promise
        });
    })
}

const waitForFormInitMultipleContiners = (multipleEmbedContainers) => {
    const INIT_EVENT = "AF_FormContainerInitialised"
    return cy.document().then(document => {
        const promiseArray = []
        cy.get('form').each(($form) => {
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    if(document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']")?.classList.contains("cmp-adaptiveform-container--loading")){
                        const isReady = () => {
                            const container = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ $form[0].id + "']");
                            if (container &&
                                e.detail._path === $form.data("cmp-path") &&
                                !container.classList.contains("cmp-adaptiveform-container--loading")) {

                                resolve(e.detail);
                            }
                            setTimeout(isReady, 0)
                        }
                        isReady();
                    }
                }
                document.addEventListener(INIT_EVENT, listener1);
            })
            if(typeof multipleEmbedContainers == "boolean" && multipleEmbedContainers){
                promiseArray.push(new Cypress.Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(promise);
                    }, 1000);
                }));
            } else {
                promiseArray.push(promise)
            }
        }).then(($lis) => {
            if(typeof multipleEmbedContainers == "boolean" && multipleEmbedContainers) {
                setTimeout(() => {
                    return Promise.all(promiseArray);
                }, 1000);
            } else {
                return Promise.all(promiseArray)
            }
        });
    })
}

const waitForChildViewAddition = () => {
    return cy.get('[data-cmp-is="adaptiveFormContainer"]')
        .then((el) => {
            const ADD_EVENT = "AF_PanelInstanceAdded";
            const promise = new Cypress.Promise((resolve, reject) => {
                const listener1 = e => {
                    resolve(e.detail.formContainer);
                };
                el[0].addEventListener(ADD_EVENT, listener1);
            })
            return promise;
        });
}

const setFocus = (elementId, formContainer) => {
    cy.get(`#${elementId}`).should('exist');
    formContainer.setFocus(elementId);
}

Cypress.Commands.add("typeText", (elementId, text, formContainer,  options = {}) => {
    setFocus(elementId, formContainer);
    if (text!=''){
        // cy.get(`#${elementId}`).should('be.visible').type(text);
        cy.get(`#${elementId}`).find("input").clear().type(text).blur();
    }
});

Cypress.Commands.add("chooseDropDown", (elementId, option, formContainer,  options = {}) => {
    setFocus(elementId, formContainer);
    cy.get(`#${elementId} select`).should("be.visible").select(option);
});

Cypress.Commands.add("clickRadioButton", (elementId, index, formContainer,  options = {}) => {
    setFocus(elementId, formContainer);
    cy.get(`#${elementId}`).find("input").eq(index).click();
});

Cypress.Commands.add("clickCheckBox", (elementId, formContainer,  options = {}) => {
    setFocus(elementId, formContainer);
    cy.get(`#${elementId}`).find("input").click();
});

Cypress.Commands.add("clickCheckBoxGroup", (elementId, index, formContainer,  options = {}) => {
    setFocus(elementId, formContainer);
    cy.get(`#${elementId}`).find("input").eq(index).click();
});

Cypress.Commands.add("checkElementVisibility", (elementId, isVisible, formContainer,options = {}) => {
    setFocus(elementId, formContainer);
    if (isVisible) {
        cy.get(`#${elementId}`).should('be.visible');
    } else {
        cy.get(`#${elementId}`).should('not.be.visible');
    }
});

Cypress.Commands.add("submitForm", (submitButtonId, formContainer,options = {}) => {
    setFocus(submitButtonId, formContainer);
    cy.get(`#${submitButtonId}-widget`).click();
});

Cypress.Commands.add("checkElementDisable", (elementId, isDisabled, formContainer,options = {}) => {
    setFocus(elementId, formContainer);
    if (isDisabled) {
        cy.get(`#${elementId}`).find("input").should("have.attr", "disabled");
    } else {
        cy.get(`#${elementId}`).find("input").should("not.have.attr", "disabled");
    }
});

Cypress.Commands.add("checkElementReadOnly", (elementId, formContainer) => {
    setFocus(elementId, formContainer);
    cy.get(`#${elementId}`).should("have.attr", "data-cmp-readonly", "true");
})

Cypress.Commands.add("getAllPanelContainerIds", (formContainer) => {
    console.log(formContainer._model);
})

Cypress.Commands.add("getRepeatedPanelCount", (panelId, formContainer) => {
    // $parentDiv = cy.get(`#${panelId}`).parent().parent().parent();
    // panelType = formContainer._fields[panelId]._model[":type"]
    // const parentId = $parentDiv.attr('id');
    // const children = formContainer._fields[parentId].children;
    // return children.length.filter((e) => e._model[":type"] === panelType).length;
})
