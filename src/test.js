export default function(ctx){
    return `
        console.log('test-loader')
        ${ctx}
    `
}