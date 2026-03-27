import endpoints from '../data/endpoints.json'

Cypress.Commands.add('api', (method, path, body = null) => {
    return cy.get('@token').then((token) => {
        return cy.request({
            method,
            url: `${endpoints.base_url}${path}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Cookie': `token=${token}`,
            },
            ...(body && { body }),
            failOnStatusCode: false,
        })
    })
})
