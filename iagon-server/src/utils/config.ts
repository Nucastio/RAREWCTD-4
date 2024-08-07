const private_key = process.env.PRIVATE_KEY as string
const network = "https://gwan-ssl.wandevs.org:46891"
const thirdweb_secretkey = process.env.THIRDWEB_SECRETKEY as string

export {
    private_key,
    network,
    thirdweb_secretkey
}