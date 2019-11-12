const globalSetup = () => {
    setEnvironment();
}

function setEnvironment() {
    process.env.ENCRYPTION_KEY = "someKey"
}

module.exports = globalSetup;