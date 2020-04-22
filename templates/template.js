

module.exports = {
    template: (confirmationCode) => {
        return (`<h1> Confirmation Email </h1>
        <hr>
        <h2> Please confirm your account clicking on the following link:</h3>
        <h4>http://localhost:3000/auth/confirm/${confirmationCode}</h4>
        <h3> Thanks for joining to our webpage!
        `)
    }
}