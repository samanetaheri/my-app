describe('Campaign Management', () => {
  it('creates multiple campaigns with different discount percentages', () => {
    cy.prompt(
          [
            `Visit google.com`,
            // Using {{adminPassword}} prevents this sensitive value from being sent to AI
            'Type Duck into the input field',
            'Click Sign In',
            'click to search',
          ],
        )
  })
})