async function getAttachmentsFromTicketCreation() {
    // @param     string      ticket.realCustomerId                               a ticket convestation identification
    // @return    string[]    ticketCreateAttachmentsUrlsFromRealCustomerApi      collection of url attachments from ticket creation
    const env = 'prod'

	const errorFactory = (errorName, error, config = null) => {
		const request = config ? `
request: ${JSON.stringify(config)}` : ''
		return new Error(`${errorName}${request}
message: ${error.message}
stack: ${error.stack}
`)
    }

    const getBaseUrl = () => {
        const messages = {
            prod: 'https://api-messages.tech4h.com.br',
            qa: 'https://qa-api-messages.hml-tech4h.com.br',
            dev: 'https://api-messages.hml-tech4h.com.br'
        } [env]
        const login = {
            prod: 'https://api-clients.tech4h.com.br/security/user/login',
            qa: 'https://qa-api-clients.hml-tech4h.com.br/security/user/login',
            dev: 'ttps://api-clients.hml-tech4h.com.br/security/user/login'
        } [env]
        return {
            messages,
            login
        }
    }

    const getLoginData = () => {
        return {
            email: 'luiz.souza@tech4h.com.br',
            password: '061730Abra',
            slug: 'orquestrador'
        }
    }

    const getTokenRealCustomer = async () => {
        const authRequest = {
            method: 'post',
            url: getBaseUrl().login,
            data: getLoginData()
        }
        try {
            const token = await axios(authRequest)
            return token.data.data.Authorization
        } catch (error) {
            delete authRequest.data.password
            throw errorFactory('Error on Real Customer Login', error, authRequest)
        }
    }

    const getConfigAttachmentUrlFactory = async (realCustomerId) => {
        const token = await getTokenRealCustomer()
        const baseUrl = getBaseUrl().messages
        return {
            method: 'get',
            url: `${baseUrl}/tech4h-messages/conversation/observer/start?id=${realCustomerId}&conversationData=true`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    }

    const validateOutput = (response) => {
        try {
            return response
                .data
                .data[0]
                .ticket
                .documentsAttached
                .map((file) => file.file_url)
        } catch (error) {
            throw errorFactory('Respons of Real Customer Message are missing the field file_url', error)
        }
    }

    const getAttachmentUrlFromRealCustomer = async (realCustomerId) => {
        const config = await getConfigAttachmentUrlFactory(realCustomerId)
        try {
            const realCustomerApi = await axios(config)
            return validateOutput(realCustomerApi)
        } catch (error) {
            throw errorFactory('Real Customer Messages Api', error, config)
        }
    }

    try {
        const ticketCreateAttachmentsUrlsFromRealCustomerApi = await getAttachmentUrlFromRealCustomer(ticket.realCustomerId)
        return {
            ticketCreateAttachmentsUrlsFromRealCustomerApi,
        }
    } catch (error) {
        throw errorFactory('Unexpected Error', error.message)
    }
}