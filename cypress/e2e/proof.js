import endpoints from '../data/endpoints.json'

describe('API Test', () => {

    beforeEach(() => {
        cy.request('POST', endpoints.base_url + endpoints.auth, {
            username: Cypress.env('username'),
            password: Cypress.env('password'),
        }).then((response) => {
            console.log(response.body)
            cy.wrap(response.body.token).as('token')
        })
    })
    it('should return a 200 status code', function () {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: endpoints.base_url + endpoints.booking,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
                console.log(response.body)
            })
        })

    })

    it('response array should be greater than 0', function () {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: endpoints.base_url + endpoints.booking,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                expect(response.body.length).to.be.greaterThan(0)
            })
        })

    })

    it('specific booking should have a booking id', function () {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: 'https://restful-booker.herokuapp.com/booking',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                expect(response.body[0].bookingid).to.be.a('number')
            })
        })
    })

    it('performance get bookings should be less than 2 seconds', function () {
        cy.get('@token').then((token) => {
            cy.request({
                method: 'GET',
                url: endpoints.base_url + endpoints.booking,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then((response) => {
                expect(response.duration).to.be.lessThan(2000)
            })
        })
    })
})