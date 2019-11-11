const globalSetup = () => {
    setEnvironment();
}

function setEnvironment() {
    process.env.ENCRYPTION_KEY = "someKey"
    process.env.POSTGRES_PORT = ""
    process.env.POSTGRES_HOST = ""
    process.env.POSTGRES_USER = ""
    process.env.POSTGRES_PASSWORD = ""
    process.env.POSTGRES_DB = ""
}

module.exports = globalSetup;