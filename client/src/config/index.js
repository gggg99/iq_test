const status = 'dev';

const dev = {
    url: 'http://localhost:80'
}

const prod = {
    url: ''
}

module.exports.config = status == 'prod' ? prod : dev;