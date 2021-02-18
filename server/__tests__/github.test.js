const GitHub = require('../lib/github')

// bdaa81233676600cbf073bfd81f3afc7806584ba
describe('Integration with GitHub API', () => {
  let github

  beforeAll(() => {
    github = new GitHub({
      accessToken: process.env.ACCESS_TOKEN,
      baseURL: 'https://api.github.com',
    })
  })

  test('Get a user', async () => {
    const res = await github.getUser('ctak')
    expect(res).toEqual(
      expect.objectContaining({
        login: 'ctak',
      })
    )
  })
})