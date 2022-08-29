const {webpack} = require('../Webpack.ts')
describe('name', () => {
    it('test', () => {
        expect(webpack()).toBe(1)
    })
})