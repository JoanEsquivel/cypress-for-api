import endpoints from '../data/endpoints.json'
import payloads from '../data/payloads.json'

describe('Bookings Test Suite', () => {

    beforeEach(() => {
        cy.request('POST', `${endpoints.base_url}${endpoints.auth}`, {
            username: Cypress.env('username'),
            password: Cypress.env('password'),
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('token').and.to.be.a('string')
            cy.wrap(response.body.token).as('token')
        })
    })

    it('CRUD booking workflow', function () {
        // CREATE
        cy.api('POST', endpoints.booking, payloads.newBooking).then((createResponse) => {
            expect(createResponse.status).to.eq(200)
            expect(createResponse.body).to.have.property('bookingid').and.to.be.a('number')
            expect(createResponse.body.booking.firstname).to.eq(payloads.newBooking.firstname)
            expect(createResponse.body.booking.lastname).to.eq(payloads.newBooking.lastname)
            expect(createResponse.body.booking.totalprice).to.eq(payloads.newBooking.totalprice)

            const bookingId = createResponse.body.bookingid

            // READ - verify creation persisted
            cy.api('GET', `${endpoints.booking}/${bookingId}`).then((readResponse) => {
                expect(readResponse.status).to.eq(200)
                expect(readResponse.body.firstname).to.eq(payloads.newBooking.firstname)
                expect(readResponse.body.lastname).to.eq(payloads.newBooking.lastname)
                expect(readResponse.body.bookingdates.checkin).to.eq(payloads.newBooking.bookingdates.checkin)
                expect(readResponse.body.bookingdates.checkout).to.eq(payloads.newBooking.bookingdates.checkout)
                expect(readResponse.body.additionalneeds).to.eq(payloads.newBooking.additionalneeds)

                // UPDATE
                cy.api('PUT', `${endpoints.booking}/${bookingId}`, payloads.updatedBooking).then((updateResponse) => {
                    expect(updateResponse.status).to.eq(200)
                    expect(updateResponse.body.totalprice).to.eq(payloads.updatedBooking.totalprice)
                    expect(updateResponse.body.depositpaid).to.eq(payloads.updatedBooking.depositpaid)
                    expect(updateResponse.body.bookingdates.checkin).to.eq(payloads.updatedBooking.bookingdates.checkin)
                    expect(updateResponse.body.bookingdates.checkout).to.eq(payloads.updatedBooking.bookingdates.checkout)
                    expect(updateResponse.body.additionalneeds).to.eq(payloads.updatedBooking.additionalneeds)

                    // READ - verify update persisted
                    cy.api('GET', `${endpoints.booking}/${bookingId}`).then((readAfterUpdateResponse) => {
                        expect(readAfterUpdateResponse.status).to.eq(200)
                        expect(readAfterUpdateResponse.body.totalprice).to.eq(payloads.updatedBooking.totalprice)
                        expect(readAfterUpdateResponse.body.depositpaid).to.eq(payloads.updatedBooking.depositpaid)
                        expect(readAfterUpdateResponse.body.bookingdates.checkin).to.eq(payloads.updatedBooking.bookingdates.checkin)
                        expect(readAfterUpdateResponse.body.bookingdates.checkout).to.eq(payloads.updatedBooking.bookingdates.checkout)

                        // DELETE
                        cy.api('DELETE', `${endpoints.booking}/${bookingId}`).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(201)

                            // READ - verify booking no longer exists
                            cy.api('GET', `${endpoints.booking}/${bookingId}`).then((readAfterDeleteResponse) => {
                                expect(readAfterDeleteResponse.status).to.eq(404)
                            })
                        })
                    })
                })
            })
        })
    })

    /**
     * NOTE: In a real-world scenario, each CRUD operation above should be its own
     * independent `it()` block with proper setup/teardown, so tests run in isolation
     * and failures are easy to pinpoint. The single-chain approach here is intentional
     * to meet the challenge requirement of demonstrating request chaining.
     */
})
